import Resource from './Resource';

import Driver from './Driver';
import Route from './Route';
import User from './User';
import Vehicle from './Vehicle';

/**
 * DispatchMessage resource
 */
class DispatchMessage extends Resource {
  /**
   * Creates a new dispatch message
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial DispatchMessage data to a new instance</caption>
   * const client = new Client();
   * const partialDispatchMessageData = {
   *   href: '/1/SYNC/dispatch_messages/1',
   *   message: 'Radio chatter...',
   * };
   * const dispatchMessage = new DispatchMessage(client, partialDispatchMessageData);
   *
   * dispatchMessage.hydrated == true;
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, rest) {
    super(client);
    const { code, ...newProperties } = rest;
    this.customerCode = code;
    const hydrated = !Object.keys(newProperties).every(k => k === 'href' || k === 'customerCode');
    const references = {
      driver: newProperties.driver && new Driver(this.client, newProperties.driver),
      route: newProperties.route && new Route(this.client, newProperties.route),
      user: newProperties.user && new User(this.client, newProperties.user),
      vehicle: newProperties.vehicle && new Vehicle(this.client, newProperties.vehicle),
    };

    Object.assign(this, newProperties, {
      hydrated,
      ...references,
    });
  }

  /**
   * Makes a href for a given customer code and ID
   * @param {string} customerCode Alphanumeric code of the customer
   * @param {Number} id DispatchMessage ID
   * @returns {string} URI to instance of dispatchMessage
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/dispatch_messages/${id}`,
      code: customerCode,
    };
  }

  /**
   * Fetches the data for this dispatchMessage via the client
   * @returns {Promise} If successful, a hydrated instance of this dispatchMessage
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(dispatchMessage => new DispatchMessage(this.client, { ...this, ...dispatchMessage }));
  }

  /**
   * Creates and sends new dispatch message via the client
   * @returns {Promise} If successful, a hydrated instance of DispatchMessage (including created ID)
   */
  create() {
    const { client, hydrated, customerCode, ...body } = this;
    return this.client.post(`/1/${customerCode}/dispatch_messages`, { body })
      .then(response => response.headers.get('location'))
      .then((href) => {
        const match = /\/\d+\/\S+\/dispatch_messages\/(\d+)/.exec(href);
        return new DispatchMessage(this.client, { ...this, href, id: parseFloat(match[1]) });
      });
  }
}
export default DispatchMessage;
