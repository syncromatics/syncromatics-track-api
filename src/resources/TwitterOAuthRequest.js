import Resource from './Resource';

/**
 * Get-only Twitter OAuth Request resource
 */
class TwitterOAuthRequest extends Resource {
  /**
   * Creates a new TwitterOAuthRequest
   *
   * Will populate itself with the values given after the client parameter
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
   * @returns {string} URI to instance of TwitterOAuthRequest
   */
  static makeHref(customerCode) {
    return {
      href: `/1/${customerCode}/twitter/oauth/request`,
      code: customerCode,
    };
  }

  fetch() {
    return this.client
      .get(this.href)
      .then(response => response.json())
      .then(oAuthRequest => new TwitterOAuthRequest(this.client, { ...this, ...oAuthRequest }));
  }
}

export default TwitterOAuthRequest;
