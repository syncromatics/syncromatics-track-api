import Resource from './Resource';

/**
 * Agency resource
 */
class Agency extends Resource {
  /**
   * Creates a new Agency object
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial agency data to a new instance</caption>
   * const client = new Client();
   * const partialAgencyData = {
   *   href: '/1/SYNC',
   *   name: 'Syncromatics',
   * };
   * const agency = new Agency(client, partialAgencyData);
   *
   * agency.hydrated == true;
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
   * @returns {string} URI to instance of agency
   */
  static makeHref(customerCode) {
    return {
      href: `/1/${customerCode}`,
      code: customerCode,
    };
  }

  /**
   * Fetches the data for this agency via the client
   * @returns {Promise} If successful, a hydrated instance of this agency
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(agency => new Agency(this.client, this, agency));
  }

  /**
   * Saves data for this agency via the client
   * @returns {Promise} If successful, returns instance of this Agency
   */
  update() {
    // eslint-disable-next-line no-unused-vars
    const { client, hydrated, ...body } = this;
    const { href } = Agency.makeHref(this.code);
    return this.client.put(href, { body })
      .then(() => new Agency(this.client, { ...this }));
  }
}

export default Agency;
