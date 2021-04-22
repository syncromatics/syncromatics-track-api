import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import AssignableStop from './AssignableStop';

/**
 * AssignableStop querying context
 *
 * This is used to query the list of Assignable Stops for a customer
 */
class AssignableStopsContext extends PagedContext {
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
   * @returns {Promise} If successful, a page of AssignableStop objects
   * @see AssignableStop
   */
  getPage() {
    return this.page(AssignableStop, `/1/${this.code}/assignable_entities/stops`);
  }
}

export default AssignableStopsContext;
