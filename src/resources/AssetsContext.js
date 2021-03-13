import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import Asset from './Asset';

/**
 * Asset querying context
 * 
 * This is used to query the list of assets for a customer
 */
class AssetsContext extends PagedContext {
  /**
   * Creates a new asset context
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
   * @returns {Promise} If successful, a page of Asset objects
   * @see Asset
   */
  getPage() {
    return this.page(Asset, `/1/${this.code}/assets`);
  }
}

export default AssetsContext;