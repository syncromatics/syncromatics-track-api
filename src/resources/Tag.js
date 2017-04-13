import Resource from './Resource';

/**
 * Tag resource
 */
class Tag extends Resource {
  /**
   * Creates a new tag
   *
   * Will populate itself with the values given to it after the client parameter
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
   * @param {Number} id Tag ID
   * @returns {string} URI to instance of tag
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/tags/${id}`,
    };
  }

  /**
   * Fetches the data for this tag via the client
   * @returns {Promise} If successful, a hydrated instance of this tag
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(tag => new Tag(this.client, this, tag));
  }
}

export default Tag;
