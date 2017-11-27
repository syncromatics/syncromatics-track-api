import JWT from 'jwt-client';
import * as messages from './subscriptions/messages';
import { DEFAULT_TRACK_API_HOST } from './Client';

const WEBSOCKET_READY_STATES = {
  CONNECTING: 0,
  OPEN: 1,
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
   * @param {string} [options.realTimeUri] The URI for the WebSocket connection to the RealTime API.
   * Defaults to production.
   */
  constructor(client, options = {}) {
    if (!client) {
      throw new Error('Argument "client" is not specified');
    }
    this.client = client;
    const { baseUri } = options;
    const baseRealTimeUri = baseUri ?
      baseUri
      .replace(/^http(s?):\/\//, 'ws$1://') // Change https? to wss?
      .replace(/$\/+/, '') // Trim trailing slashes
      :
      `wss://${DEFAULT_TRACK_API_HOST}`;
    const realTimeUri = `${baseRealTimeUri}/1/realtime`;
    this.options = {
      realTimeUri,
      reconnectOnClose: true,
      ...options,
    };

    // dummy object for safe calling semantics later
    this.connection = {};

    this.queuedMessages = [];

    this.subscriptions = {};
    this.openRequests = {};

    // since these handlers are often called from elsewhere they must be
    // bound
    this.onConnectionClosed = this.onConnectionClosed.bind(this);
    this.onConnectionOpened = this.onConnectionOpened.bind(this);
    this.onMessageReceived = this.onMessageReceived.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  /**
   * Closes the open realtime connection (if applicable) while temporarily disabling the reconnect.
   * @returns {void}
   */
  closeConnection() {
    const { reconnectOnClose } = this.options;
    this.options.reconnectOnClose = false;
    if (this.connection && typeof this.connection.close === 'function') {
      this.connection.close();
    }
    this.options.reconnectOnClose = reconnectOnClose;
  }

  /**
   * Creates a new WebSocket connection to the Track Real Time API and sends authentication
   * messages.
   * @returns {void}
   */
  createConnection() {
    const connection = new WebSocket(this.options.realTimeUri);
    connection.onopen = this.onConnectionOpened;
    connection.onclose = this.onConnectionClosed;
    connection.onmessage = this.onMessageReceived;
    this.connection = connection;
  }

  /**
   * Event handler fired when the WebSocket connection is closed.
   * Re-establishes the connection, if configured to do so.
   * @returns {void}
   */
  onConnectionClosed() {
    if (this.options.reconnectOnClose) {
      // the WebSocket API doesn't offer a way to re-open a closed connection.
      // remove our connection and create a new one.
      delete this.connection;
      this.createConnection();
    }
  }

  /**
   * Event handler fired when the WebSocket connection is opened.
   * Sends authentication headers and any messages queued before the connection was established.
   * @returns {void}
   */
  onConnectionOpened() {
    this.sendAuthentication()
      .then(() => {
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
            subscriptionStartResolver,
            subscriptionEndRejecter,
            subscriptionEndResolver,
          } = this.openRequests[message.request_id];
          subscriptionStartResolver(message);
          delete this.openRequests[message.request_id];

          const { queuedMessages } = this.subscriptions[message.subscription_id] || {};
          if (queuedMessages) {
            queuedMessages.forEach(qm => handler(qm));
          }

          this.subscriptions[message.subscription_id] = {
            handler,
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
    return this.client.authenticated
      .then(() => {
        const authToken = JWT.get();
        const authMessage = messages.creators.createAuthRequest(authToken);
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
    const messagePromise = new Promise((resolve) => { resolver = resolve; });
    this.queuedMessages.push({
      resolver,
      serialized,
    });
    if (this.connection.readyState !== WEBSOCKET_READY_STATES.CONNECTING) {
      this.createConnection();
    }
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
    const message = messages.creators.createSubscriptionRequest(entity, customerCode, filters);
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
    this.openRequests[message.request_id] = {
      handler: handlerFunc,
      subscriptionStartResolver,
      subscriptionStartRejecter,
      subscriptionEndResolver,
      subscriptionEndRejecter,
    };
    return this.sendMessage(message)
      .then(() => subscriptionStart)
      .then(success => this.stopSubscription.bind(this, success.subscription_id, subscriptionEnd));
  }

  /**
   * Ends a subscription to the Track Real Time API.
   * @param {string} subscriptionId Identity of the subscription
   * @param {Promise} subscriptionEnd Promise that will be resolved upon end of the subscription
   * @returns {void}
   */
  stopSubscription(subscriptionId, subscriptionEnd) {
    const subscriptionEndRequest = {
      type: messages.SUBSCRIPTION_END.REQUEST,
      subscription_id: subscriptionId,
    };

    return this.sendMessage(subscriptionEndRequest)
      .then(() => subscriptionEnd);
  }
}

export default RealTimeClient;
