import Resource from './Resource';

/**
 * Detour resource
 */
class Detour extends Resource {
  /**
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance
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
   * Makes a href for a given customer code and detour id
   * @param {string} customerCode Customer code
   * @param {number} id Detour ID
   * @returns {{href: string}} URI to instance of detour
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/serviceadjustments/detour/${id}`,
    };
  }

  /**
   * Fetches the data for this detour via the client
   * @returns {Promise} If successful, a hydrated instance of this detour
   */
  fetch() {
    return this.client.get(this.href)
        .then(response => response.json())
        .then(detour => new Detour(this.client, this, detour));
  }
}

export default Detour;