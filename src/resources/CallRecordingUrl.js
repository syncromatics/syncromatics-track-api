import Resource from './Resource';

/**
 * CallRecordingUrl resource
 */
class CallRecordingUrl extends Resource {
  /**
   * Creates a new call recording url
   *
   * Will populate itself with the values given to it after the client parameter
   * @param {Client} client Instance of pre-configured client
   * @param {Object} rest The object to use in assigning values to this instance
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
   * @param {Number} id Call ID
   * @returns {string} URI to instance of call recording url
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/calls/${id}/recording`,
    };
  }

  /**
   * Fetches the call recording url via the client
   * @returns {Promise} If successful, a hydrated instance of this recording
   */
  fetch() {
    return this.client.get(this.href)
        .then(response => response.json())
        .then(url => new CallRecordingUrl(this.client, this, url));
  }
}

export default CallRecordingUrl;
