import Resource from './Resource';

/**
 * External API resource
 */
class ExternalApi extends Resource {
  /**
   * Creates a new External Api
   *
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
   * @param {Number} id External API ID
   * @returns {string} URI to instance of external API
   */
  static makeHref(id) {
    return {
      href: `/1/external_apis/${id}`,
    };
  }

  /**
   * Fetches the data for this external API via the client
   * @returns {Promise} If successful, a hydrated instance of this external API
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(externalApi => new ExternalApi(this.client, this, externalApi));
  }
}

export default ExternalApi;
