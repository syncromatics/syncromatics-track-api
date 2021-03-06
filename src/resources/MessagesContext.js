import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import Message from './Message';

/**
 * Message querying context
 *
 * This is used to query the list of messages for a customer
 */
class MessagesContext extends PagedContext {
  /**
   * Creates a new message context
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
   * const messages = new MessagesContext(...);
   * messages
   *   .withQuery('12')
   *   .getPage()
   *   .then(page => ...);
   * @param {string} term Query term to search for
   * @returns {MessagesContext} Returns itself
   */
  withQuery(term) {
    this.params.q = term;
    return this;
  }

  /**
   * Gets the first page of results for this context
   * @returns {Promise} If successful, a page of Message objects
   * @see Message
   */
  getPage() {
    return this.page(Message, `/1/${this.code}/messages`);
  }
}

export default MessagesContext;
