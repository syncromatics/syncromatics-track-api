import Resource from './Resource';

/**
 * Write-only Twitter OAuth resource
 */
class TwitterOAuth extends Resource {
  /**
   * Creates a new TwitterOAuth
   *
   * Will populate itself with the values given after the client parameter
   * @param {Client} client Instance of pre-configured client
   * @param {Object} rest The object to use in assigning values to this instance
   */
  constructor(client, rest) {
    super(client);
    const { code, ...newProperties } = rest;
    this.customerCode = code;
    Object.assign(this, newProperties, {
      hydrated: false,
    });
  }

  /**
   * Makes a href for a given customer code
   * @param {string} customerCode Customer code
   * @returns {string} URI to instance of TwitterOAuth
   */
  static makeHref(customerCode) {
    return {
      href: `/1/${customerCode}/twitter/oauth`,
      code: customerCode,
    };
  }

  /**
   * Saves data for this Twitter OAuth to the server
   *
   * Does not return the created object since TwitterOAuth
   * is meant to be write-only.
   * @returns {Promise} If successful, returns a completed promise.
   */
  update() {
    const { client, customerCode, hydrated, ...body } = this;
    const { href } = TwitterOAuth.makeHref(customerCode);
    return client.put(href, { body }).then(() => ({ success: true }));
  }

  /**
   * Removes stored Twitter OAuth information via the client
   * @returns {Promise} If successful, returns a resolved promise
   */
  delete() {
    const { client, customerCode } = this;
    const { href } = TwitterOAuth.makeHref(customerCode);
    return client.delete(href).then(() => {});
  }
}

export default TwitterOAuth;
