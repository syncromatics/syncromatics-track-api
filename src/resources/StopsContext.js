import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import Stop from './Stop';

/**
 * Stop querying context
 *
 * This is used to query the list of stops for a customer
 */
class StopsContext extends PagedContext {
  /**
   * Creates a new stop context
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
   * const stops = new StopContext(...);
   * stops
   *   .withQuery('12')
   *   .getPage()
   *   .then(page => ...);
   * @param {string} term Query term to search for
   * @returns {StopsContext} Returns itself
   */
  withQuery(term) {
    this.params.q = term;
    return this;
  }

  /**
   * Gets the first page of results for this context
   * @returns {Promise} If successful, a page of Stop objects
   * @see Stop
   */
  getPage() {
    return this.page(Stop, `/1/${this.code}/stops`);
  }
}

export default StopsContext;
