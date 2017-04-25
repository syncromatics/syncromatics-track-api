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
   * Makes a href for a given customer code and ID
   * @param {string} customerCode Customer code
   * @param {Number} id Tag ID
   * @returns {string} URI to instance of tag
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/tags/${id}`,
      code: customerCode,
    };
  }

  /**
   * Fetches the data for this tag via the client
   * @returns {Promise} If successful, a hydrated instance of this tag
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(tag => new Tag(this.client, { ...this, ...tag }));
  }

  /**
   * Saves data for a tag via the client
   * @returns {Promise} if successful returns a tag with the id included
   */
  create() {
    const { client, hydrated, customerCode, ...body } = this;
    return this.client.post(`/1/${this.customerCode}/tags`, { body })
      .then(response => response.headers.get('location'))
      .then((href) => {
        const match = /\/\d+\/\S+\/tags\/(\d+)/.exec(href);
        return new Tag(this.client, { ...this, href, id: parseFloat(match[1]) });
      });
  }

  /**
   * Updates data for a tag via the client
   * @returns {Promise} if successful returns instance of this tag
   */
  update() {
    const { client, hydrated, customerCode, ...body } = this;
    return this.client.put(`/1/${this.customerCode}/tags/${this.id}`, { body })
      .then(() => new Tag(this.client, { ...this }));
  }

}

export default Tag;
