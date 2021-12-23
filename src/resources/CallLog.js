import Resource from './Resource';

/**
 * CallLog resource
 */
class CallLog extends Resource {
  /**
   * Creates a new historical call log
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
   * @param {number} id Call log ID
   * @returns {{href: string, code: string}} URI to instance of call log
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/calls_historical/${id}`,
      code: customerCode,
    };
  }

  /**
   * Fetches the data for this call log via the client
   * @returns {Promise} If successful, a hydrated instance of this call log
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(callLog => new CallLog(this.client, { ...this, ...callLog }));
  }
}

export default CallLog;
