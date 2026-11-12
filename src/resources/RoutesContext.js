import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import Route from './Route';

/**
 * Route querying context
 *
 * This is used to query the list of routes for a customer
 */
class RoutesContext extends PagedContext {
  /**
   * Creates a new route context
   * @param {Client} client Instance of pre-configured client
   * @param {string} customerCode Customer code
   * @param {Object} params Object of querystring parameters to append to the URL
   */
  constructor(client, customerCode, params) {
    super(client, { ...params });
    this.code = customerCode;
  }

  /**
   * Sets the query term for the context
   * @example
   * const routes = new RoutesContext(...);
   * routes
   *   .withQuery('blue')
   *   .getPage()
   *   .then(page => ...);
   * @param {string} term Query term to search for
   * @returns {RoutesContext} Returns itself
   */
  withQuery(term) {
    this.params.q = term;
    return this;
  }

  /**
   * Filters base routes by pattern types, for example [1, 4] for routes and headways.
   * @param {number[]} types Pattern types to serialize as a comma-separated filter
   * @returns {RoutesContext} Returns itself
   */
  withPatternTypes(types) {
    this.params.pattern_types = types.join(',');
    return this;
  }

  /**
   * Includes base routes that have no patterns. Omit this call for existing server defaults.
   * @param {boolean} [includeEmpty=true] Whether to include empty base routes
   * @returns {RoutesContext} Returns itself
   */
  withEmptyRoutes(includeEmpty = true) {
    this.params.include_empty = includeEmpty;
    return this;
  }

  /**
   * Gets the first page of results for this context
   * @returns {Promise} If successful, a page of Route objects
   * @see Route
   */
  getPage() {
    return this.page(Route, `/1/${this.code}/routes`);
  }
}

export default RoutesContext;
