import Resource from './Resource';

/**
 * EnplugScreenshot resource
 */
class EnplugScreenshot extends Resource {
  /**
   * Creates a new enplugScreenshot
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial enplug screenshot data to a new instance</caption>
   * const client = new Client();
   * const partialEnplugScreenshot = {
   *   href: '/1/SYNC/enplugs/LLM3/screenshot',
   *   contentType: 'image/jpeg',
   *   name: '1',
   * };
   * const enplugScreenshot = new EnplugScreenshot(client, partialEnplugScreenshot);
   *
   * enplugScreenshot.hydrated == true;
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
   * @returns {string} URI to instance of enplug screenshot
   */
  static makeHref(customerCode, deviceSerial) {
    return {
      href: `/1/${customerCode}/enplugs/${deviceSerial}/screenshot`,
    };
  }

  /**
   * Fetches the data for this enplug screenshot via the client
   * @returns {Promise} If successful, a hydrated instance of this enplug screenshot
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => new EnplugScreenshot(this.client, this, {
        name: response.headers.get('Name'),
        contentType: response.headers.get('Content-Type'),
        data: response.blob(),
      }));
  }
}

export default EnplugScreenshot;
