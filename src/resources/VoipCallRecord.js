import Resource from './Resource';

/**
 * VoipCallRecord resource
 */
class VoipCallRecord extends Resource {
  /**
   * Creates a new historical voip call record
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
   * @param {number} id Voip call record ID
   * @returns {{href: string, code: string}} URI to instance of voip call record
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/calls_historical/${id}`,
      code: customerCode,
    };
  }

  /**
   * Fetches the data for this voip call record via the client
   * @returns {Promise} If successful, a hydrated instance of this voip call record
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(voipCallRecord => new VoipCallRecord(this.client, { ...this, ...voipCallRecord }));
  }
}

export default VoipCallRecord;
