import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import MessageChannel from './MessageChannel';

/**
 * MessageChannels querying context
 *
 * This is used to query the list of message channels for a customer
 */
class MessageChannelsContext extends PagedContext {
  /**
   * Creates a new message channel context
   * @param {Client} client Instance of pre-configured client
   * @param {string} customerCode Customer code
   * @param {Object} params Object of querystring parameters to append to the URL
   */
  constructor(client, customerCode, params) {
    super(client, { ...params });
    this.code = customerCode;
  }

  /**
   * Gets the first page of results for this context
   * @returns {Promise} If successful, a page of MessageChannel objects
   * @see MessageChannel
   */
  getPage() {
    return this.page(MessageChannel, `/1/${this.code}/message_channels`);
  }
}

export default MessageChannelsContext;
