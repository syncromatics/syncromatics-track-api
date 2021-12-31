import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import CallLog from './CallLog';

/**
 * Call log querying context
 *
 * This is used to query the list of call logs for a customer
 */
class CallLogsContext extends PagedContext {
  /**
   * Creates a new call logs context
   * @param {Client} client Instance of pre-configured client
   * @param {string} customerCode  Customer code
   * @param {object} params Object of querystring parameters to append to the URL
   */
  constructor(client, customerCode, params) {
    super(client, { ...params });
    this.code = customerCode;
  }

  /**
   * Sets the query term for the context
   * @example
   * const callLogs = new CallLogsContext(...);
   * call logs
   *   .withQuery('blue')
   *   .getPage()
   *   .then(page => ...);
   * @param {string} term Query term to search for
   * @returns {CallLogsContext} Returns itself
   */
  withQuery(term) {
    this.params.q = term;
    return this;
  }

  /**
   * Sets the start date to search for call logs
   * @example
   * const callLogs = new CallLogsContext(...);
   * callLogs
   *   .sinceDate('2018-01-31')
   *   .getPage()
   *   .then(page => ...);
   * @param {string} date Parsable string representing the date
   * @returns {DispatchMessagesContext} Returns itself
   */
  fromDate(date) {
    this.params.from = date;
    return this;
  }

  /**
   * Sets the end date to search for call logs
   * @example
   * const callLogs = new CallLogsContext(...);
   * callLogs
   *   .endDate('2018-01-31')
   *   .getPage()
   *   .then(page => ...);
   * @param {string} date Parsable string representing the date
   * @returns {DispatchMessagesContext} Returns itself
   */
  toDate(date) {
    this.params.from = date;
    return this;
  }

  /**
   * Gets the first page of results for this context
   * @returns {Promise} If successful, a page of CallLog objects
   * @see CallLog
   */
  getPage() {
    return this.page(CallLog, `/1/${this.code}/calls_historical`);
  }
}

export default CallLogsContext;
