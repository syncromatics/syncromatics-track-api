import Resource from './Resource';

/**
 * MessageChannels resource
 */
class MessageChannels extends Resource {
  /**
   * Creates a new MessageChannels.
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial message channels data to a new instance</caption>
   * const client = new Client();
   * const partialMessageChannelsData = [{
   *   href: '/1/SYNC/message_channel/GTFS-RT',
   *   name: 'GTFS-RT',
   * }];
   * const messageChannel = new MessageChannel(client, partialMessageChannelsData);
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
   * Makes a href for a given customer code
   * @param {string} customerCode Customer code
   * @returns {{href: string}} URI to instance of messageChannels
   */
  static makeHref(customerCode) {
    return {
      href: `/1/${customerCode}/message_channels`,
    };
  }

  /**
   * Fetches the data for this message channel via the client
   * @returns {Promise} If successful, a hydrated instance of this messageChannels
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(messageChannels => new MessageChannels(this.client, this, messageChannels));
  }
}

export default MessageChannels;
