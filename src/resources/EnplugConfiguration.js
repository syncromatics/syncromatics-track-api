import Resource from './Resource';

/**
 * EnplugConfiguration resource
 */
class EnplugConfiguration extends Resource {
  /**
   * Creates a new enplugConfiguration
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial enplug configuration data to a new instance</caption>
   * const client = new Client();
   * const partialEnplugConfiguration = {
   *   href: '/1/SYNC/enplugs/LLM3/configuration',
   *   volume: 27,
   *   vehicleHref: '/1/SYNC/vehicles/1234',
   * };
   * const enplugConfiguration = new EnplugConfiguration(client, partialEnplugConfiguration);
   *
   * enplugConfiguration.hydrated == true;
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, ...rest) {
    super(client);

    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href');

    Object.assign(this, newProperties, {
      hydrated,
    });
  }

  /**
   * Makes a href for a given customer code and ID
   * @param {string} customerCode Customer code
   * @param {string} deviceSerial Enplug Serial
   * @returns {string} URI to instance of enplug configuration
   */
  static makeHref(customerCode, deviceSerial) {
    return {
      href: `/1/${customerCode}/enplugs/${deviceSerial}/configuration`,
    };
  }

  /**
   * Updates configuration for an enplug via the client
   * @returns {Promise} if successful returns instance of this user
   */
  update() {
    // eslint-disable-next-line no-unused-vars
    const { client, hydrated, href, ...body } = this;
    return this.client.put(href, { body })
      .then(() => new EnplugConfiguration(this.client, { ...this }));
  }
}

export default EnplugConfiguration;
