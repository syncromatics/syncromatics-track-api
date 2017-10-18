import JWT from 'jwt-client';
import * as messages from './subscriptions/messages';

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
    this.options = {
      realTimeUri: 'wss://track-api.syncromatics.com/1/realtime',
      reconnectOnClose: true,
      ...options,
    };

    // dummy object for safe calling semantics later
    this.connection = {};

    this.queuedMessages = [];

    // TODO: these will (probably) be used when implementing subscriptions
    // in an upcoming story.
    this.subscriptions = [];
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
      // authentication messages
      case messages.AUTHENTICATION.FAILURE:
        throw new Error('Authentication failed when establishing real-time connection.');
      case messages.AUTHENTICATION.SUCCESS:
        if (typeof this.authenticatedResolve === 'function') {
          this.authenticatedResolve();
          delete this.authenticatedResolve;
        }
        return;
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
   * @returns {Promise} A promise that resolves when the subscription request has been sent.
   */
  startSubscription(entity, customerCode, filters, handlerFunc) {
    // TODO: these subscriptions don't actually work yet.  Still need to correlate subscription
    // success messages received from the server with our request IDs and handle appropriately.
    // subscriptions will be implemented in an upcoming story.
    const message = messages.creators.createSubscriptionRequest(entity, customerCode, filters);
    this.openRequests[message.request_id] = handlerFunc;
    return this.sendMessage(message);
  }
}

export default RealTimeClient;
