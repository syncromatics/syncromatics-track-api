import Resource from './Resource';

/**
 * Read-only Twitter Username resource.
 */
class TwitterUsername extends Resource {
  /**
   * Creates a new TwitterUsername
   *
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
   * Makes a href for a given customer code
   * @param {string} customerCode Customer code
   * @returns {string} URI to instance of call
   */
  static makeHref(customerCode) {
    return {
      code: customerCode,
      href: `/1/${customerCode}/twitter/username`,
    };
  }

  /**
   * Fetches the data for this TwitterUsername via the client
   * @returns {Promise} If successful, a hydrated instance of this TwitterUsername
   */
  fetch() {
    const { customerCode } = this;
    const { href } = TwitterUsername.makeHref(customerCode);
    return this.client.get(href)
      .then(response => response.json())
      .then(username => new TwitterUsername(this.client, { ...this, ...username }));
  }
}

export default TwitterUsername;
