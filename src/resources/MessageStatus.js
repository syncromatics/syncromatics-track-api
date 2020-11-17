import Resource from './Resource';

/**
 * Message Status resource
 */
class MessageStatus extends Resource {
  /**
   * Creates a new MessageStatus
   *
   * Will populate itself with the values given to it after the client parameter
   * @param {Client} client Instance of pre-configured client
   * @param {Object} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, rest) {
    super(client);
    const {
      code,
      ...newProperties
    } = rest;
    this.customerCode = code;
    const hydrated = !Object.keys(newProperties).every(k => k === 'href' || k === 'customerCode');
    Object.assign(this, newProperties, {
      hydrated,
    });
  }

  /**
   * Makes a href for a dispatch message status endpoint for a customer
   * @param {string} customerCode Customer code
   * @returns {string} URI to instance of incident
   */
  static makeHref(customerCode) {
    return {
      href: `/1/${customerCode}/dispatch_message_statuses`,
      code: customerCode,
    };
  }

  /**
   * Mark a list of messages as read
   * @param {Array.<Resource|string>} messages Messages to mark as read
   * @returns {Promise} If successful, indicates if the messages have been marked as read
   */
  markMessagesRead(messages) {
    return this.client.post(`${this.href}`, { body: messages });
  }
}

export default MessageStatus;
