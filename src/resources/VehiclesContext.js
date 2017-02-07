import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import Vehicle from './Vehicle';

/**
 * Vehicle querying context
 *
 * This is used to query the list of vehicles for a customer
 */
class VehiclesContext extends PagedContext {
  /**
   * Creates a new vehicle context
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
   * const vehicles = new VehicleContext(...);
   * vehicles
   *   .withQuery('12')
   *   .getPage()
   *   .then(page => ...);
   * @param {string} term Query term to search for
   * @returns {VehiclesContext} Returns itself
   */
  withQuery(term) {
    this.params.q = term;
    return this;
  }

  /**
   * Gets the first page of results for this context
   * @returns {Promise} If successful, a page of Vehicle objects
   * @see Vehicle
   */
  getPage() {
    return this.page(Vehicle, `/1/${this.code}/vehicles`);
  }
}

export default VehiclesContext;
