import Resource from './Resource';

/**
 * Call resource
 */
class Call extends Resource {
  /**
   * Creates a new call
   *
   * Will populate itself with the values given to it after the client parameter
   * @param {Client} client Instance of pre-configured client
   * @param {Object} rest The object to use in assigning values to this instance
   */
  constructor(client, rest) {
    super(client);
    const { code, ...newProperties } = rest;
    this.customerCode = code;
    const hydrated = !Object.keys(newProperties).every(k => k === 'href' || k === 'customerCode');
    Object.assign(this, newProperties, {
      hydrated,
    });
  }

  /**
   * Makes a href for a given customer code and ID
   * @param {string} customerCode Customer code
   * @param {Number} id Call ID
   * @returns {string} URI to instance of call
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/calls/${id}`,
      code: customerCode,
    };
  }

  /**
   * Fetches the data for this call via the client
   * @returns {Promise} If successful, a hydrated instance of this call
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(call => new Call(this.client, { ...this, ...call }));
  }

  /**
   * Saves data for a call via the client
   * @returns {Promise} if successful returns a call with the id included
   */
  create() {
    // eslint-disable-next-line no-unused-vars
    const { client, hydrated, customerCode, ...body } = this;
    return this.client.post(`/1/${this.customerCode}/calls`, { body })
      .then(response => response.headers.get('location'))
      .then((href) => {
        const match = /\/\d+\/\S+\/calls\/(\d+)/.exec(href);
        return new Call(this.client, { ...this, href, id: parseFloat(match[1]) });
      });
  }

  /**
   * Updates data for a call via the client
   * @returns {Promise} if successful returns instance of this call
   */
  end() {
    const { href } = Call.makeHref(this.customerCode, this.id);
    this.ended = new Date().toISOString();
    return this.client.patch(href, {
      body: [
        {
          op: 'replace',
          path: '/ended',
          value: this.ended,
        },
      ],
    });
  }
}

export default Call;
