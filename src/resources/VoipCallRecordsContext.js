import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import VoipCallRecord from './VoipCallRecord';

/**
 * Voip call record querying context
 *
 * This is used to query the list of voip call records for a customer
 */
class VoipCallRecordsContext extends PagedContext {
  /**
   * Creates a new voip call records context
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
   * const voipCallRecords = new VoipCallRecordsContext(...);
   * voip call records
   *   .withQuery('blue')
   *   .getPage()
   *   .then(page => ...);
   * @param {string} term Query term to search for
   * @returns {VoipCallRecordsContext} Returns itself
   */
  withQuery(term) {
    this.params.q = term;
    return this;
  }

  /**
   * Sets the start date to search for voip call records
   * @example
   * const voipCallRecords = new VoipCallRecordsContext(...);
   * voipCallRecords
   *   .fromDate('2018-01-31')
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
   * Sets the end date to search for voip call records
   * @example
   * const voipCallRecords = new VoipCallRecordsContext(...);
   * voipCallRecords
   *   .toDate('2018-01-31')
   *   .getPage()
   *   .then(page => ...);
   * @param {string} date Parsable string representing the date
   * @returns {DispatchMessagesContext} Returns itself
   */
  toDate(date) {
    this.params.to = date;
    return this;
  }

  /**
   * Gets the first page of results for this context
   * @returns {Promise} If successful, a page of VoipCallRecord objects
   * @see VoipCallRecord
   */
  getPage() {
    return this.page(VoipCallRecord, `/1/${this.code}/calls_historical`);
  }
}

export default VoipCallRecordsContext;
