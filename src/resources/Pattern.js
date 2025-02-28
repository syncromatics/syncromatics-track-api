import Resource from './Resource';
import Route from './Route';

/**
 * Route resource
 */
class Pattern extends Resource {
  /**
   * Creates a new pattern
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial route data to a new instance</caption>
   * const client = new Client();
   * const partialPatternData = {
   *   href: '/1/SYNC/patterns/2',
   *   name: '9876',
   * };
   * const pattern = new Pattern(client, partialPatternData);
   *
   * pattern.hydrated == true;
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, ...rest) {
    super(client);

    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href');

    const references = {};
    if (newProperties.route) {
      references.route = new Route(this.client, newProperties.route);
    }

    Object.assign(this, newProperties, {
      hydrated,
      ...references,
    });

    // Ensure 'route' is completely removed if it's null or empty
    if (!this.route) {
      delete this.route;
    }
  }

  /**
   * Makes a href for a given customer code and ID
   * @param {string} customerCode Customer code
   * @param {Number} id Pattern ID
   * @param {Object} [options] Options for expanding the pattern
   * @param {boolean} [options.expandStops] Expand stops
   * @param {boolean} [options.expandRoute] Expand route
   * @returns {string} URI to instance of pattern
   */
  static makeHref(customerCode, id, options) {
    const { expandStops, expandRoute} = options || {};
    const expanded = [
      expandStops && 'stops',
      expandRoute && 'route',
    ].filter(Boolean).join(',');
    return {
      href: `/1/${customerCode}/patterns/${id}${expanded ? `?expand=${expanded}` : ''}`,
    };
  }

  /**
   * Fetches the data for this pattern via the client
   * @returns {Promise} If successful, a hydrated instance of this pattern
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(pattern => new Pattern(this.client, this, pattern));
  }
}

export default Pattern;
