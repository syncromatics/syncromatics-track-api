import Resource from './Resource';
import DispatchMessage from './DispatchMessage';

class DispatchMessageBatch extends Resource {
  /**
   * Creates a new dispatch message batch
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial dispatchMessageBatch data to a new instance</caption>
   * const client = new Client();
   * const partialData = {
   *   href: '/1/SYNC/dispatch_messages/batches/90892e24-5279-4066-b109-a112925edb89',
   *   dispatch_messages: [
   *     { href: '/1/SYNC/dispatch_messages/1' },
   *     { href: '/1/SYNC/dispatch_messages/2' }
   *   ]
   * };
   * const dispatchMessageBatch = new DispatchMessageBatch(client, partialData);
   *
   * dispatchMessageBatch.hydrated == true
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, rest) {
    super(client);
    const { code, ...newProperties } = rest;
    this.customerCode = code;
    const hydrated = !Object.keys(newProperties).every(k => k === 'href' || k === 'customerCode');
    const references = {
      dispatch_messages: newProperties.dispatch_messages
        && newProperties.dispatch_messages.map(m => new DispatchMessage(this.client, m)),
    };

    Object.assign(this, newProperties, {
      hydrated,
      ...references,
    });
  }

  /**
   * Makes a href for a given customer code and ID
   * @param {string} customerCode  Alphanumeric code of the customer
   * @param {string} id ID of the dispatch message batch
   * @returns {object} href object containing URL for the instance
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/dispatch_messages/batches/${id}`,
      code: customerCode,
    };
  }

  /**
   * Fetches the data for this dispatch message batch via the client
   * @returns {Promise} If successful, a hydrated instance of this dispatch message batch
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(batch => new DispatchMessageBatch(this.client, { ...this, ...batch }));
  }

  /**
   * Creates a new dispatch message batch via the client
   * @returns {Promise} If successful, a hydrated instance of this dispatch message batch with id
   */
  create() {
    const { client, hydrated, customerCode, ...body } = this;
    return this.client.post(`/1/${customerCode}/dispatch_messages/batches`, { body })
      .then(response => response.headers.get('location'))
      .then((href) => {
        const match = /\/\d+\/\S+\/dispatch_messages\/batches\/(\S+)/.exec(href);
        return new DispatchMessageBatch(this.client, { ...this, href, id: match[1] });
      });
  }
}

export default DispatchMessageBatch;
