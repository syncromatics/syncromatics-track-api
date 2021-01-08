import * as messages from './subscriptions/messages';
import { DEFAULT_TRACK_API_HOST } from './Client';

const WEBSOCKET_READY_STATES = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

/**
 * A client that can be used for creating, maintaining, and monitoring WebSocket connections to the
 * Track Real Time API.
 */
class RealTimeClient {
  /**
   * Creates a new realtime client
   * @param {Client} client Instance of pre-configured REST client
   * @param {Object} options Options for using the client to connect to the Track API
   * @param {boolean} [options.reconnectOnClose] Whether to re-establish a connection when the
   * current connection is closed.  Defaults to true.
   * @param {number} [options.reconnectTimeout] Number of milliseconds to wait before reattempting
   * a connection
   * @param {string} [options.realTimeUri] The URI for the WebSocket connection to the RealTime API.
   * Defaults to production.
   */
  constructor(client, options = {}) {
    if (!client) {
      throw new Error('Argument "client" is not specified');
    }
    this.client = client;
    const { baseUri } = options;
    const baseRealTimeUri = baseUri
      ? baseUri
          .replace(/^http(s?):\/\//, 'ws$1://') // Change https? to wss?
          .replace(/$\/+/, '') // Trim trailing slashes
      : `wss://${DEFAULT_TRACK_API_HOST}`;
    const realTimeUri = `${baseRealTimeUri}/1/realtime`;
    this.options = {
      realTimeUri,
      reconnectOnClose: true,
      ...options,
    };

    // dummy object for safe calling semantics later
    this.connection = {};
    this.initializing = false;
    this.timeoutHandles = [];

    this.queuedMessages = [];
    this.disconnectHandlers = [];
    this.reconnectHandlers = [];

    this.subscriptions = {};
    this.openRequests = {};
    this.heartbeatHandlers = new Set();

    // since these handlers are often called from elsewhere they must be
    // bound
    this.onConnectionClosed = this.onConnectionClosed.bind(this);
    this.onConnectionOpened = this.onConnectionOpened.bind(this);
    this.onMessageReceived = this.onMessageReceived.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.queueAndRemoveSubscriptions = this.queueAndRemoveSubscriptions.bind(this);

    this.addEventListener = this.addEventListener.bind(this);
    this.removeEventListener = this.removeEventListener.bind(this);
  }

  /**
   * Adds an event listener to be called whenever the client disconnects unexpectedly
   * or subsequently reconnects.
   * @param {string} type The event name on which the listener should fire.  Must be either
   * 'disconnect' or 'reconnect'.
   * @param {function} listener The listener function to be fired as appropriate.
   * @returns {void}
   */
  addEventListener(type, listener) {
    if (typeof listener !== 'function') {
      const msg = 'You must pass a function as `listener` to addEventListener';
      throw new Error(msg);
    }
    switch (type) {
      case 'disconnect':
        this.disconnectHandlers.push(listener);
        break;
      case 'reconnect':
        this.reconnectHandlers.push(listener);
        break;
      default: {
        const msg = 'You must pass "disconnect" or "reconnect" as `type` to addEventListener.';
        throw new Error(msg);
      }
    }
  }

  /**
   * Removes a previously added event listener for unexpected disconnects or reconnects, using
   * strict equality comparisons.
   * @param {string} type The event name from which the listener should be remove.  Must be either
   * 'disconnect' or 'reconnect'.
   * @param {function} listener The listener function to be removed.
   * @returns {void}
   */
  removeEventListener(type, listener) {
    switch (type) {
      case 'disconnect':
        this.disconnectHandlers = this.disconnectHandlers.filter((x) => x !== listener);
        break;
      case 'reconnect':
        this.reconnectHandlers = this.reconnectHandlers.filter((x) => x !== listener);
        break;
      default: {
        const msg = 'You must pass "disconnect" or "reconnect" as `type` to removeEventListener.';
        throw new Error(msg);
      }
    }
  }

  /**
   * Closes the open realtime connection (if applicable) while temporarily superceding the reconnect
   * @returns {void}
   * @param {Object} options Options specific for this single call
   * @param {boolean} [options.shouldReconnect] Whether to re-open the connection after manually
   * closing the connection.  Defaults to false.
   */
  closeConnection(options = {}) {
    const { reconnectOnClose } = this.options;
    this.options.reconnectOnClose = !!options.shouldReconnect;
    this.timeoutHandles.forEach(clearTimeout);
    if (this.connection && typeof this.connection.close === 'function') {
      this.connection.close();
    }
    this.options.reconnectOnClose = reconnectOnClose;
  }

  /**
   * Creates a new WebSocket connection to the Track Real Time API and sends authentication
   * messages.
   * @param {Function} [onInitialize] Function to execute upon initializing a connection
   * @returns {void}
   */
  createConnection(onInitialize) {
    if (this.initializing) return;
    const readyState = this.connection.readyState || WEBSOCKET_READY_STATES.CLOSED;
    switch (readyState) {
      case WEBSOCKET_READY_STATES.OPEN:
      case WEBSOCKET_READY_STATES.CONNECTING:
      case WEBSOCKET_READY_STATES.CLOSING:
        return;
      default:
        {
          this.initializing = true;
          const connection = new WebSocket(this.options.realTimeUri);
          connection.onopen = this.onConnectionOpened;
          connection.onclose = this.onConnectionClosed;
          connection.onerror = this.onConnectionClosed;
          connection.onmessage = this.onMessageReceived;
          this.connection = connection;
          if (onInitialize) onInitialize();
        }
        break;
    }
  }

  /**
   * Event handler fired when the WebSocket connection is closed.
   * Re-establishes the connection, if configured to do so.
   * @returns {void}
   */
  onConnectionClosed() {
    const { reconnectOnClose = false, reconnectTimeout = 0 } = this.options;
    if (reconnectOnClose) {
      if (!this.isInReconnectLoop) {
        this.isInReconnectLoop = true;
        this.queueAndRemoveSubscriptions((x) => x.openRequests);
        this.queueAndRemoveSubscriptions((x) => x.subscriptions);
        this.disconnectHandlers.forEach((handler) => {
          if (typeof handler === 'function') {
            setTimeout(handler, 0);
          }
        });
      }
      this.initializing = false;
      // the WebSocket API doesn't offer a way to re-open a closed connection.
      // remove our connection and create a new one.
      const reconnect = () => this.createConnection();
      this.timeoutHandles.push(setTimeout(reconnect, reconnectTimeout));
    }
  }

  /**
   * Event handler fired when the WebSocket connection is opened.
   * Sends authentication headers and any messages queued before the connection was established.
   * @returns {void}
   */
  onConnectionOpened() {
    if (this.connection.readyState !== WEBSOCKET_READY_STATES.OPEN) {
      console.error(
        `onConnectionOpened fired but WS Connection is ${this.connection.readyState}. Restarting connection.`,
      );
      return;
    }
    this.initializing = false;
    if (this.isInReconnectLoop) {
      delete this.isInReconnectLoop;
      this.reconnectHandlers.forEach((handler) => {
        if (typeof handler === 'function') {
          setTimeout(handler, 0);
        }
      });
    }
    this.sendAuthentication().then(() => {
      this.queuedMessages.forEach((queuedMessage) => {
        this.connection.send(queuedMessage.serialized);
        queuedMessage.resolver();
      });
      this.queuedMessages.length = 0;
    });
  }

  /**
   * Event handler fired when a message is received on the WebSocket connection.
   * Handles Authentication messages.  Otherwise, parses the message and delegates to the
   * appropriate handler.
   * @param {MessageReceivedEvent} event The event received from the WebSocket.
   * @returns {void}
   */
  onMessageReceived(event) {
    const message = JSON.parse(event.data);
    switch (message.type) {
      case messages.AUTHENTICATION.FAILURE:
        throw new Error('Authentication failed when establishing real-time connection.');
      case messages.AUTHENTICATION.SUCCESS:
        if (typeof this.authenticatedResolve === 'function') {
          this.authenticatedResolve();
          delete this.authenticatedResolve;
        }
        return;
      case messages.SUBSCRIPTION_START.SUCCESS:
        {
          const {
            handler,
            messageCreator,
            mutableSubscriptionContainer,
            subscriptionStartResolver,
            subscriptionEndRejecter,
            subscriptionEndResolver,
          } = this.openRequests[message.request_id];
          subscriptionStartResolver(message);
          delete this.openRequests[message.request_id];

          const { queuedMessages } = this.subscriptions[message.subscription_id] || {};
          if (queuedMessages) {
            queuedMessages.forEach((qm) => handler(qm));
          }

          mutableSubscriptionContainer.subscriptionId = message.subscription_id;

          this.subscriptions[message.subscription_id] = {
            handler,
            messageCreator,
            mutableSubscriptionContainer,
            subscriptionEndRejecter,
            subscriptionEndResolver,
          };
        }
        break;
      case messages.SUBSCRIPTION_START.FAILURE:
        {
          const { subscriptionStartRejecter } = this.openRequests[message.request_id] || {};
          subscriptionStartRejecter(message);
          delete this.openRequests[message.request_id];
        }
        break;
      case messages.SUBSCRIPTION_END.SUCCESS:
        {
          const { subscriptionEndResolver } = this.subscriptions[message.subscription_id] || {};
          if (subscriptionEndResolver) {
            subscriptionEndResolver(message);
            delete this.subscriptions[message.subscription_id];
          }
        }
        break;
      case messages.SUBSCRIPTION_END.FAILURE:
        {
          const { subscriptionEndRejecter } = this.subscriptions[message.subscription_id] || {};
          if (subscriptionEndRejecter) {
            subscriptionEndRejecter(message);
          }
        }
        break;
      case messages.ENTITY.UPDATE:
      case messages.ENTITY.DELETE:
        {
          const subscription = this.subscriptions[message.subscription_id] || {
            queuedMessages: [],
          };
          if (subscription.handler) {
            subscription.handler(message);
            return;
          }

          subscription.queuedMessages.push(message);
          this.subscriptions[message.subscription_id] = subscription;
        }
        break;
      case messages.HEARTBEAT:
        this.heartbeatHandlers.forEach((handler) => handler(message));
        break;
      default:
        throw new Error(`Unsupported message received from Track Realtime API:\n${event.data}`);
    }
  }

  /**
   * Awaits successful login from the REST API, and then sends an authentication message with the
   * received JWT on the open WebSocket connection to the Real Time API.
   * @returns {Promise} A Promise resolved when an authentication success message is received.
   */
  sendAuthentication() {
    return this.client.authenticated.then(() => {
      const { token } = this.client.getJwt();
      const authMessage = messages.creators.createAuthRequest(token);
      const serialized = JSON.stringify(authMessage);
      this.connection.send(serialized);
      return new Promise((resolve) => {
        this.authenticatedResolve = resolve;
      });
    });
  }

  /**
   * Serializes a JSON message and queues it to send to the Track Real Time API when the connection
   * is opened.  Opens a connection if one is not opened already.
   * @param {Object} message The message to send.
   * @returns {Promise} A promise that is resolved when the message has been sent.
   */
  sendMessage(message) {
    const serialized = JSON.stringify(message);
    if (this.connection.readyState === WEBSOCKET_READY_STATES.OPEN) {
      this.connection.send(serialized);
      return Promise.resolve();
    }

    let resolver;
    const messagePromise = new Promise((resolve) => {
      resolver = resolve;
    });
    this.queuedMessages.push({
      resolver,
      serialized,
    });
    this.createConnection();
    return messagePromise;
  }

  /**
   * Creates a subscription to the Track Real Time API.
   * @param {string} entity The name of the subscribed entity
   * @param {string} customerCode The Customer for whose data the subscription will be created.
   * @param {Object} filters Filters to be passed for the created subscription.
   * @param {function} handlerFunc The function to fire when updates are received for this
   * subscription.
   * @returns {Promise} A promise that resolves when the subscription request has been sent. The
   * value of the resolved promise is a function that will end the subscription.
   */
  startSubscription(entity, customerCode, filters, handlerFunc) {
    let subscriptionStartResolver;
    let subscriptionStartRejecter;
    const subscriptionStart = new Promise((resolve, reject) => {
      subscriptionStartResolver = resolve;
      subscriptionStartRejecter = reject;
    });
    let subscriptionEndResolver;
    let subscriptionEndRejecter;
    const subscriptionEnd = new Promise((resolve, reject) => {
      subscriptionEndResolver = resolve;
      subscriptionEndRejecter = reject;
    });
    const mutableSubscriptionContainer = {
      subscriptionId: undefined,
    };
    const messageCreator = () =>
      messages.creators.createSubscriptionRequest(entity, customerCode, filters);
    return this.sendStartSubscriptionMessage(
      messageCreator,
      handlerFunc,
      mutableSubscriptionContainer,
      subscriptionStartResolver,
      subscriptionStartRejecter,
      subscriptionEndResolver,
      subscriptionEndRejecter,
    )
      .then(() => subscriptionStart)
      .then(() => this.stopSubscription.bind(this, mutableSubscriptionContainer, subscriptionEnd));
  }

  sendStartSubscriptionMessage(
    messageCreator,
    handler,
    mutableSubscriptionContainer,
    onStartSuccess,
    onStartFailure,
    onEndSuccess,
    onEndFailure,
  ) {
    const message = messageCreator();
    this.openRequests[message.request_id] = {
      messageCreator,
      handler,
      mutableSubscriptionContainer,
      subscriptionStartResolver: onStartSuccess,
      subscriptionStartRejecter: onStartFailure,
      subscriptionEndResolver: onEndSuccess,
      subscriptionEndRejecter: onEndFailure,
    };
    return this.sendMessage(message);
  }

  /**
   * Ends a subscription to the Track Real Time API.
   * @param {object} subscriptionContainer Object containing the current subscription ID
   * @param {String} subscriptionContainer.subscriptionId Identity of the current subscription
   * @param {Promise} subscriptionEnd Promise that will be resolved upon end of the subscription
   * @returns {void}
   */
  stopSubscription(subscriptionContainer, subscriptionEnd) {
    const subscriptionEndRequest = {
      type: messages.SUBSCRIPTION_END.REQUEST,
      subscription_id: subscriptionContainer.subscriptionId,
    };

    return this.sendMessage(subscriptionEndRequest).then(() => subscriptionEnd);
  }

  /**
   * Registers a heartbeat handler that will be called for every heartbeat received.
   * @param {function} heartbeatHandler function(heartbaet) to be called for each heartbeat.
   * @returns {void}
   */
  registerHeartbeatHandler(heartbeatHandler) {
    if (typeof heartbeatHandler !== 'function') {
      throw new Error('You may only register functions as heartbeatHandlers.');
    }
    this.heartbeatHandlers.add(heartbeatHandler);
  }

  /**
   * Removes a previously registered heartbeat handler.
   * @param {function} heartbeatHandler The handler to remove.
   * @returns {void}
   */
  removeHeartbeatHandler(heartbeatHandler) {
    this.heartbeatHandlers.delete(heartbeatHandler);
  }

  queueAndRemoveSubscriptions(mutableBucketSelector) {
    const mutableBucket = mutableBucketSelector(this);
    const defaultSubscriptionStartResolver = () => {};
    const defaultSubscriptionStartRejector = () => new Error('Could not resume subscription');
    Object.keys(mutableBucket)
      .map((id) => ({
        ...mutableBucket[id],
        id,
      }))
      .forEach(
        ({
          id,
          handler,
          messageCreator,
          mutableSubscriptionContainer,
          subscriptionStartResolver,
          subscriptionStartRejecter,
          subscriptionEndRejecter,
          subscriptionEndResolver,
        }) => {
          this.sendStartSubscriptionMessage(
            messageCreator,
            handler,
            mutableSubscriptionContainer,
            subscriptionStartResolver || defaultSubscriptionStartResolver,
            subscriptionStartRejecter || defaultSubscriptionStartRejector,
            subscriptionEndResolver,
            subscriptionEndRejecter,
          );
          delete mutableBucket[id];
        },
      );
  }
}

export default RealTimeClient;
