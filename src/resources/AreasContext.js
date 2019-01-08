import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import Area from './Area';

/**
 * Area querying context
 *
 * This is used to query the list of areas for a customer
 */
class AreasContext extends PagedContext {
  /**
   * Creates a new areas context
   * @param {Client} client Instance of pre-configured client
   * @param {string} customerCode  Customer code
   * @param {object} params Object of querystring parameters to append to the URL
   */
  constructor(client, customerCode, params) {
    super(client, { ...params });
    this.code = customerCode;
  }

  /**
   * Gets the first page of results for this context
   * @returns {Promise} If successful, a page of Areas objects
   * @see Area
   */
  getPage() {
    return this.page(Area, `/1/${this.code}/areas`);
  }
}

export default AreasContext;
