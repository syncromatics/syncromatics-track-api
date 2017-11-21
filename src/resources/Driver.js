import Resource from './Resource';

/**
 * Driver resource
 */
class Driver extends Resource {

  /**
   * Creates a new driver.
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial driver data to a new instance</caption>
   * const client = new Client();
   * const partialDriverData = {
   *   href: '/1/SYNC/drivers/1',
   *   id: 1,
   *   customer_driver_id: '0001',
   *   first_name: 'Charlie',
   *   last_name: 'Singh',
   * };
   * const driver = new Driver(client, partialDriverData);
   *
   * driver.hydrated == true;
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, ...rest) {
    super(client);

    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href');
    Object.assign(this, newProperties, { hydrated });
  }

  /**
   * Makes a href for a given customer code and DI
   * @param {string} customerCode Customer code
   * @param {number} id Driver ID
   * @returns {{href: string}} URI to instance of driver
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/drivers/${id}`,
    };
  }

  /**
   * Fetches the data for this driver via the client
   * @returns {Promise} If successful, a hydrated instance of this driver
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(driver => new Driver(this.client, this, driver));
  }
}

export default Driver;
