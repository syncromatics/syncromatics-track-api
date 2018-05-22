// eslint-disable-next-line import/no-extraneous-dependencies
import { Server } from 'mock-socket';
import * as messages from '../subscriptions/messages';
import dispatchMessages from './dispatchMessages';
import stopArrivals from './stopArrivals';
import vehicleArrivals from './vehicleArrivals';
import vehicles from './vehicles';

const realTimeUri = 'ws://localhost:8083/1/realtime';
const realTime = {
  uri: realTimeUri,
  options: {
    realTimeUri,
  },
  authenticatedClient: {
    authenticated: Promise.resolve(),
  },
  subscriptionIdCounter: 0,

  /**
   * Returns a websocket server to which you can attach events.
   * It provides a number of convenience methods for testing:
   * - It will already have a handler to respond to authentication messages with success.
   * - It has an added onTrackMessage property, which allows you to define a handler for
   *   a specific Track message type.
   * - It has a verifySubscription property, which can be used to monitor incoming messages, verify
   *   a request for a subscription has been made, and automatically close the server connection and
   *   (if passed in) an associated RealTimeClient.
   * @returns {Server} a server object, with added convenience properties.
   */
  getServer: () => {
    const server = new Server(realTimeUri);
    /**
     * A convenience method -- will deserialize JSON received by the web socket and check the 'type'
     * property.  If it matches what you passed in, it will execute `handler` with the deserialized
     * event data.
     * @param {String} messageType String to verify against the 'type' property of the received data
     * @param {function} handler The handler function to execute if 'type' matches.
     * @returns {Promise} A promise that is resolved with the received message when handler fires.
     */
    server.onTrackMessage = (messageType, handler) => {
      if (typeof handler !== 'function') return;
      server.on('message', (data) => {
        const message = JSON.parse(data);
        if (message.type === messageType) {
          handler(message);
        }
      });
    };

    /**
     * Monitors incoming messages for a subscription request to the specified entity.
     * When one is found, it strips the request of its [type, customer, entity, request_id]
     * properties to leave only the filters.  Returns a promise that resolves with all of the
     * filters.
     * @param {String} entityName The name of the entity for which to check for subscriptions
     * @param {Object} options An options object.
     * @param {boolean} [options.closeConnection] Whether to immediately close the server and a
     * passed-in RealTimeClient after receiving the subscription request.
     * @param {RealTimeClient} [options.realTimeClient] The real time client to close if closing the
     * connection.
     * @returns {Promise} A promise that resolves with all filters passed in for the request
     * function.
     */
    server.verifySubscription = (entityName, options = {}) => {
      let resolver;
      const promise = new Promise((resolve) => {
        resolver = resolve;
      });
      server.onTrackMessage(messages.SUBSCRIPTION_START.REQUEST, (data) => {
        if (data.entity === entityName) {
          // eslint-disable-next-line no-unused-vars
          const {
            type,
            customer,
            entity,
            request_id,
            ...rest
          } = data;

          if (options.closeConnection) {
            // it's important to close the realtime client before the server,
            // otherwise the client will attempt to reconnect.
            server.closeConnection(options.realTimeClient);
          }
          resolver(rest);
        }
      });
      return promise;
    };

    server.closeConnection = (realTimeClient) => {
      if (realTimeClient && typeof realTimeClient.closeConnection === 'function') {
        realTimeClient.closeConnection();
      }
      server.close();
    };

    // automatically accept any authentication request our test server receives.
    server.onTrackMessage(messages.AUTHENTICATION.REQUEST, () => {
      const response = JSON.stringify({
        type: messages.AUTHENTICATION.SUCCESS,
      });
      server.emit('message', response);

      server.onTrackMessage(messages.SUBSCRIPTION_START.REQUEST, (request) => {
        realTime.subscriptionIdCounter += 1;
        const subscriptionId = realTime.subscriptionIdCounter;

        server.emit('message', JSON.stringify({
          type: messages.SUBSCRIPTION_START.SUCCESS,
          request_id: request.request_id,
          subscription_id: subscriptionId,
        }));

        let data;
        switch (request.entity) {
          case 'ASSIGNMENTS':
            data = vehicles.list.map(v => v.assignment);
            break;
          case 'DISPATCH_MESSAGES':
            data = dispatchMessages.list;
            break;
          case 'STOP_ARRIVALS':
            data = stopArrivals.list;
            break;
          case 'STOPTIMES':
            console.warn('Need to define mocks for STOPTIMES');
            data = [];
            break;
          case 'VEHICLE_ARRIVALS':
            data = vehicleArrivals.list;
            break;
          case 'VEHICLES':
            data = vehicles.list.map((vehicle) => {
              const {
                // eslint-disable-next-line no-unused-vars
                assignment: ignored,
                ...rest
              } = vehicle;
              return rest;
            });
            break;
          default:
            throw new Error(`Don't know what to emit for ${request.entity}`);
        }

        server.emit('message', JSON.stringify({
          type: messages.ENTITY.UPDATE,
          subscription_id: subscriptionId,
          data,
        }));
      });

      server.onTrackMessage(messages.SUBSCRIPTION_END.REQUEST, (request) => {
        server.emit('message', JSON.stringify({
          type: messages.SUBSCRIPTION_END.SUCCESS,
          request_id: request.request_id,
          subscription_id: request.subscription_id,
        }));
      });
    });
    return server;
  },
};

export default realTime;
