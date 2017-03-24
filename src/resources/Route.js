import Resource from './Resource';
import Assignment from './Assignment';

/**
 * Route resource
 */
class Route extends Resource {
  /**
   * Creates a new route
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial route data to a new instance</caption>
   * const client = new Client();
   * const partialRouteData = {
   *   href: '/1/SYNC/routes/2',
   *   name: '9876',
   * };
   * const route = new Route(client, partialRouteData);
   *
   * route.hydrated == true;
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, ...rest) {
    super(client);

    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href');
    const references = {
      assignment: newProperties.assignment && new Assignment(this.client, newProperties.assignment),
    };

    Object.assign(this, newProperties, {
      hydrated,
      ...references,
    });
  }

  /**
   * Makes a href for a given customer code and ID
   * @param {string} customerCode Customer code
   * @param {Number} id Route ID
   * @returns {string} URI to instance of route
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/routes/${id}`,
    };
  }

  /**
   * Fetches the data for this route via the client
   * @returns {Promise} If successful, a hydrated instance of this route
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(route => new Route(this.client, this, route));
  }
}

export default Route;
