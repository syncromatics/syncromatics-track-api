import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import DispatchMessage from './DispatchMessage';

/**
 * Dispatch Message querying context
*
 * This is used to query the list of dispatch messages for a customer
 */
class DispatchMessagesContext extends PagedContext {
  /**
   * Creates a new dispatch messages context
   * @param {Client} client Instance of pre-configured client
   * @param {string} customerCode Alphanumeric code of the customer
   * @param {object} params Object of querystring parameters to append to the URL
   */
  constructor(client, customerCode, params) {
    super(client, { ...params });
    this.code = customerCode;
  }

  /**
   * Sets the query term for the context
   * @example
   * const dispatchMessages = new DispatchMessagesContext(...);
   * dispatchMessages
   *   .withQuery('radio chatter')
   *   .getPage()
   *   .then(page => ...);
   * @param {string} term Query term to search for in dispatch message text
   * @returns {DispatchMessagesContext} Returns itself
   */
  withQuery(term) {
    this.params.q = term;
    return this;
  }

  /**
   * Sets the driver for whom to retrieve dispatch messages
   * @example
   * const dispatchMessages = new DispatchMessagesContext(...);
   * dispatchMessages
   *   .forDriver(1)
   *   .getPage()
   *   .then(page => ...);
   * @param {number} driverId Id of the driver
   * @returns {DispatchMessagesContext} Returns itself
   */
  forDriver(driverId) {
    this.params.driver_id = driverId;
    return this;
  }

  /**
   * Sets the vehicle for which to retrieve dispatch messages
   * @example
   * const dispatchMessages = new DispatchMessagesContext(...);
   * dispatchMessages
   *   .forVehicle(1)
   *   .getPage()
   *   .then(page => ...);
   * @param {number} vehicleId Id of the vehicle
   * @returns {DispatchMessagesContext} Returns itself
   */
  forVehicle(vehicleId) {
    this.params.vehicle_id = vehicleId;
    return this;
  }

  /**
   * Sets the start date to search for dispatch messages
   * @example
   * const dispatchMessages = new DispatchMessagesContext(...);
   * dispatchMessages
   *   .sinceDate('2018-01-31')
   *   .getPage()
   *   .then(page => ...);
   * @param {string} date Parsable string representing the date
   * @returns {DispatchMessagesContext} Returns itself
   */
  sinceDate(date) {
    this.params.start = date;
    return this;
  }


  /**
   * Sets the end date to search for dispatch messages
   * @example
   * const dispatchMessages = new DispatchMessagesContext(...);
   * dispatchMessages
   *   .endDate('2020-01-31')
   *   .getPage()
   *   .then(page => ...);
   * @param {string} date Parsable string representing the date
   * @returns {DispatchMessagesContext} Returns itself
   */
  beforeDate(date) {
    this.params.end = date;
    return this;
  }

  /**
   * Gets the first page of results for this context
   * @returns {Promise} If successful, a page of DispatchMessage objects
   * @see DispatchMessage
   */
  getPage() {
    return this.page(DispatchMessage, `/1/${this.code}/dispatch_messages`);
  }
}

export default DispatchMessagesContext;
