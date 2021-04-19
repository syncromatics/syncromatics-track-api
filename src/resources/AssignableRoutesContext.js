import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import AssignableRoute from './AssignableRoute';

/**
 * AssignableRoutes querying context
 *
 * This is used to query the list of Assignable Routes for a customer
 */
class AssignableRoutesContext extends PagedContext {
  /**
   *
   * @param {Client} client Instance of pre-configurred client
   * @param {string} customerCode Customer code
   * @param {object} params Object of querystring parameters to append to the URL
   */
  constructor(client, customerCode, params) {
    super(client, { ...params });
    this.code = customerCode;
  }

  /**
   * Gets the first page of results for this context
   * @returns {Promise} If successful, a page of AssignableRoute objects
   * @see AssignableRoute
   */
  getPage() {
    return this.page(AssignableRoute, `/1/${this.code}/assignable_entities/routes`);
  }
}

export default AssignableRoutesContext;
