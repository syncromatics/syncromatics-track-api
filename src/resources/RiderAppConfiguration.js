import Resource from './Resource';

/**
 * Rider App Configuration resource
 */
class RiderAppConfiguration extends Resource {
  /**
   * Creates a new RiderAppConfiguration.
   *
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, ...rest) {
    super(client);

    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href' || k === 'code');

    Object.assign(this, newProperties, {
      hydrated,
    });
  }

  /**
   * Creates an href for a given customer code
   *
   * @param {string} customerCode Customer code
   * @returns {{href: string}} URI to instance of Rider App Configuration
   */
  static makeHref(customerCode) {
    return {
      href: `/1/${customerCode}/rider_app_configuration`,
      code: customerCode,
    };
  }

  /**
   * Fetches the Rider App Configuration for this customer data via the client
   * @returns {Promise} If successful,a hydrated instance of Rider App Configuration
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(config => new RiderAppConfiguration(this.client, this, config));
  }

  /**
   * Updates the Rider App Configuration for this customer via the client
   * @returns {Promise} If successful, returns the updated Rider App Configuration
   */
  update() {
    // eslint-disable-next-line no-unused-vars
    const { client, hydrated, code, ...body } = this;
    const { href } = RiderAppConfiguration.makeHref(code);
    return this.client.put(href, { body })
      .then(() => new RiderAppConfiguration(this.client, { ...this }));
  }
}

export default RiderAppConfiguration;
