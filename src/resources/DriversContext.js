import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import Driver from './Driver';

/**
 * Driver querying context
 *
 * This is used to query the list of drivers for a customer
 */
class DriversContext extends PagedContext {
  /**
   * Creates a new drivers context
   * @param {Client} client Instance of pre-configured client
   * @param {string} customerCode  Customer code
   * @param {object} params Object of querystring parameters to append to the RUL
   */
  constructor(client, customerCode, params) {
    super(client, { ...params });
    this.code = customerCode;
  }

  /**
   * Sets the query term for the context
   * @example
   * const drivers = new DriversContext(...);
   * patterns
   *   .withQuery('blue')
   *   .getPage()
   *   .then(page => ...);
   * @param {string} term Query term to search for
   * @returns {DriversContext} Returns itself
   */
  withQuery(term) {
    this.params.q = term;
    return this;
  }

  /**
   * Gets the first page of results for this context
   * @returns {Promise} If successful, a page of Driver objects
   * @see Driver
   */
  getPage() {
    return this.page(Driver, `/1/${this.code}/drivers`);
  }
}

export default DriversContext;
