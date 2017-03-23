import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import Sign from './Sign';

/**
 * Sign querying context
 *
 * This is used to query the list of signs for a customer
 */
class SignsContext extends PagedContext {
  /**
   * Creates a new sign context
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
   * const signs = new SignsContext(...);
   * signs
   *   .withQuery('12')
   *   .getPage()
   *   .then(page => ...);
   * @param {string} term Query term to search for
   * @returns {SignsContext} Returns itself
   */
  withQuery(term) {
    this.params.q = term;
    return this;
  }

  /**
   * Gets the first page of results for this context
   * @returns {Promise} If successful, a page of Sign objects
   * @see Sign
   */
  getPage() {
    return this.page(Sign, `/1/${this.code}/signs`);
  }
}

export default SignsContext;
