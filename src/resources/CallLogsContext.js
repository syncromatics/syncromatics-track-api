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
   * Gets the first page of results for this context
   * @returns {Promise} If successful, a page of Call Log objects
   * @see CallLog
   */
  getPage() {
    return this.page(CallLog, `/1/${this.code}/calls_historical`);
  }

  /**
   * Fetches the data for customer call logs via the client
   * @returns {Promise} If successful, hydrated instances of call logs
   */
  fetch() {
    return this.client.get(`/1/${this.code}/calls_historical`)
        .then(response => response.json())
  }
}

export default CallLogsContext;
