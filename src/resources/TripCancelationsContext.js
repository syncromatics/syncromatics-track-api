import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import Area from "./Area";

/**
 * TripCancelations querying context
 *
 * This is used to query the list of TripCancelations for a customer
 * (and serviceDate, but this component is computed within track-api
 * based on customer timezone and server time at the time of request)
 */
class TripCancelationsContext extends PagedContext {
  /**
   * Creates a new trip cancelations context
   * @param {Client} client Instance of pre-configured client
   * @param {string} customerCode Customer code
   * @param {object} params Object of querystring parameters to append to the URL
   */
  constructor(client, customerCode, params) {
    super(client, { ...params });
    this.code = customerCode;
  }

  /**
   * Gets the first page of results for this context
   * @returns {Promise} If successful, a page of Trip Cancelation objects
   * @see Area
   */
  getPage() {
    return this.page(Area, `/1/${this.code}/serviceadjustments/cancelations`);
  }
}
export default TripCancelationsContext;