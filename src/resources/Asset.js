import Resource from './Resource';

/**
 * Asset resource
 */
class Asset extends Resource {
  /**
   * Creates a new Asset.
   * 
   * @param {Client} client Instance of pre-configured client
   * @param  {Array} rest  Remaining arguments to use in assigning values to this instance
   */
  constructor(client, ...rest) {
    super(client);

    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href' || k === 'code');

    Object.assign(this, newProperties, {
      hydrated,
    });
  }

  /**
   * Makes a href for a given customer code and ID
   * @param {string} customerCode Customer code
   * @param {number} id Asset ID
   * @returns {{href: string}} URI to instance of asset
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/assets/${id}`,
      code: customerCode,
    };
  }

  /**
   * Fetches the data for this asset via the client
   * @returns {Promise} If successful, a hydrated instance of this asset
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(asset => new Asset(this.client, this, asset));
  }

  /**
   * Saves data for a new asset via the client
   * @returns {Promise} if successful, returns an asset with the id property set
   */
  create() {
    // eslint-disable-next-line no-unused-vars
    const { client, hydrated, code, ...body } = this;
    return this.client.post(`/1/${this.code}/assets`, { body })
      .then(response => response.headers.get('location'))
      .then((href) => {
        const match = /\/\d+\/\S+\/assets\/(\d+)/.exec(href);
        return new Asset(this.client, { ...this, href, id: parseFloat(match[1]) });
      });
  }

  /**
   * Updates this asset to mark it as permanently saved via the client
   * @returns {Promise} if successful, returns an instance of this asset
   */
  markSaved() {
    const { href } = Asset.makeHref(this.code, this.id);
    this.is_saved = true;
    return this.client.patch(href, {
      body: [
        {
          op: 'replace',
          path: '/is_saved',
          value: this.is_saved,
        },
      ],
    });
  }
}

export default Asset;