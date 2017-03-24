import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import MessageTemplate from './MessageTemplate';

/**
 * Message template querying context
 *
 * This is used to query the list of message templates for a customer
 */
class MessageTemplatesContext extends PagedContext {
  /**
   * Creates a new message template context
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
   * const messageTemplates = new MessageTemplatesContext(...);
   * messageTemplates
   *   .withQuery('12')
   *   .getPage()
   *   .then(page => ...);
   * @param {string} term Query term to search for
   * @returns {MessageTemplatesContext} Returns itself
   */
  withQuery(term) {
    this.params.q = term;
    return this;
  }

  /**
   * Gets the first page of results for this context
   * @returns {Promise} If successful, a page of MessageTemplate objects
   * @see MessageTemplate
   */
  getPage() {
    return this.page(MessageTemplate, `/1/${this.code}/message_templates`);
  }
}

export default MessageTemplatesContext;
