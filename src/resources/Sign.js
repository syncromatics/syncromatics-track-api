import Resource from './Resource';

/**
 * Sign resource
 */
class Sign extends Resource {
  /**
   * Creates a new sign
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial sign data to a new instance</caption>
   * const client = new Client();
   * const partialSignData = {
   *   href: '/1/SYNC/signs/2',
   *   name: 'The second sign',
   * };
   * const sign = new Sign(client, partialSignData);
   *
   * sign.hydrated == true;
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
   * @param {Number} id Sign ID
   * @returns {string} URI to instance of sign
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/signs/${id}`,
    };
  }

  /**
   * Fetches the data for this sign via the client
   * @returns {Promise} If successful, a hydrated instance of this sign
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(sign => new Sign(this.client, this, sign));
  }

  /**
   * Updates data for a sign via the client.
   * Note: only updates approach_announcements_enabled and approach_announcements_seconds.
   * @returns {Promise} if successful returns instance of this sign
   */
  update() {
    return this.client.patch(this.href, {
      body: [
        {
          op: 'replace',
          path: '/approach_announcements_enabled',
          value: this.approach_announcements_enabled,
        },
        {
          op: 'replace',
          path: '/approach_announcements_seconds',
          value: this.approach_announcements_seconds,
        },
      ],
    });
  }
}

export default Sign;
