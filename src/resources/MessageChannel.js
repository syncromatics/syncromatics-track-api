import Resource from './Resource';

/**
 * MessageChannel resource
 */
class MessageChannel extends Resource {
  /**
   * Creates a new MessageChannel.
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial message channel data to a new instance</caption>
   * const client = new Client();
   * const partialMessageChannelData = {
   *   href: '/1/SYNC/message_channel/GTFS-RT',
   *   name: 'GTFS-RT',
   * };
   * const messageChannel = new MessageChannel(client, partialMessageChannelData);
   * messageChannel.hydrated === true;
   *
   * @param {Client} client Instance of pre-configured client
   * @param  {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, ...rest) {
    super(client);

    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href' || k === 'code');

    Object.assign(this, newProperties, { hydrated });
  }

  /**
   * Makes a href for a given customer code and ID
   * @param {string} customerCode Customer code
   * @param {string} name Message Channel name
   * @returns {{href: string}} URI to instance of message channel
   */
  static makeHref(customerCode, name) {
    return {
      href: `/1/${customerCode}/message_channels/${name}`,
    };
  }

  /**
   * Fetches the data for this message channel via the client
   * @returns {Promise} If successful, a hydrated instance of this message channel
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(messageChannel => new MessageChannel(this.client, this, messageChannel));
  }
}

export default MessageChannel;
