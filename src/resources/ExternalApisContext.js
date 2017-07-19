import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import ExternalApi from './ExternalApi';

/**
 * ExternalApi querying context
 *
 * This is used to query the list of external APIs for a customer
 */
class ExternalApisContext extends PagedContext {
  /**
   * Creates a new route context
   * @param {Client} client Instance of pre-configured client
   * @param {Object} params Object of querystring parameters to append to the URL
   */
  constructor(client, params) {
    super(client, { ...params });
  }

  /**
   * Sets the query term for the context
   * @example
   * const externalApis = new ExternalApisContext(...);
   * externalApis
   *   .withQuery('arrivals')
   *   .getPage()
   *   .then(page => ...);
   * @param {string} term Query term to search for
   * @returns {ExternalApisContext} Returns itself
   */
  withQuery(term) {
    this.params.q = term;
    return this;
  }

  /**
   * Gets the first page of results for this context
   * @returns {Promise} If successful, a page of ExternalApi objects
   * @see ExternalApi
   */
  getPage() {
    return this.page(ExternalApi, '/1/external_apis');
  }
}

export default ExternalApisContext;
