import Resource from './Resource';

/**
 * Role resource
 */
class Role extends Resource {
  /**
   * Creates a new Role
   *
   * Will populate itself with the values given to it after the client parameter
   * @param {Client} client Instance of pre-configured client
   * @param  {Object} rest The object to use in assigning values to this instance
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
   * Makes a href for a given ID
   * @param {Number} id Role ID
   * @returns {string} URI to instance of the Role
   */
  static makeHref(id) {
    return {
      href: `/1/roles/${id}`,
    };
  }

  /**
   * Fetches the data for this Role via the client
   * @returns {Promise} If successful, a hydrated instance of this Role
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(role => new Role(this.client, { ...this, ...role }));
  }
}

export default Role;
