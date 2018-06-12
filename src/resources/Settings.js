import Resource from './Resource';

/**
 * Settings resource
 */
class Settings extends Resource {
  /**
   * Creates a new customer settings resource
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial settings data to a new instance</caption>
   * const client = new Client();
   * const partialSettingsData = {
   *   href: '/1/SYNC/settings',
   *   sign_in_type: 'trip',
   * };
   * const settings = new Settings(client, partialSettingsData);
   *
   * settings.hydrated == true;
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
   * Makes a href for a given customer code
   * @param {string} customerCode Customer code
   * @returns {string} URI to instance of setting
   */
  static makeHref(customerCode) {
    return {
      href: `/1/${customerCode}/settings`,
    };
  }

  /**
   * Fetches the data for these settings via the client
   * @returns {Promise} If successful, a hydrated instance of these settings
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(settings => new Settings(this.client, this, settings));
  }
}

export default Settings;
