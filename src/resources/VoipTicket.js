import Resource from './Resource';

/**
 * VoipTicket resource
 */
class VoipTicket extends Resource {
  /**
   * Creates a new VoipTicket object
   *
   * Will populate itself with the values given to it after the client parameter
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, ...rest) {
    super(client);

    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href' || k === 'code');

    Object.assign(this, newProperties, { hydrated });
  }

  /**
   * Makes a href for a given customer code
   * @param {string} customerCode Customer code
   * @returns {string} URI to instance of voip ticket
   */
  static makeHref(customerCode) {
    return {
      href: `/1/${customerCode}/voip_ticket`,
      code: customerCode,
    };
  }

  /**
   * Fetches the data for this voip ticket via the client
   * @returns {Promise} If successful, a hydrated instance of a frehs voip ticket
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(voipTicket => new VoipTicket(this.client, this, voipTicket));
  }
}

export default VoipTicket;
