import Resource from './Resource';
import SignMessage from './SignMessage';
import Route from './Route';
import Stop from './Stop';
import Tag from './Tag';
/**
 * Message resource
 */
class Message extends Resource {
  /**
   * Creates a new message
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial message data to a new instance</caption>
   * const client = new Client();
   * const partialMessageData = {
   *   href: '/1/SYNC/messages/1',
   *   name: '5k Detour',
   *   text: 'Due to the 5k Race...',
   * };
   * const message = new Message(client, partialMessageData);
   *
   * message.hydrated == true;
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, rest) {
    super(client);
    const { code, ...newProperties } = rest;
    this.customerCode = code;
    const hydrated = !Object.keys(newProperties).every(k => k === 'href' || k === 'customerCode');
    const references = {
      routes: newProperties.routes
        && newProperties.routes.map(r => new Route(this.client, r)),
      sign_messages: newProperties.sign_messages
        && newProperties.sign_messages.map(sm => new SignMessage(this.client, sm)),
      stops: newProperties.stops
        && newProperties.stops.map(s => new Stop(this.client, s)),
      tags: newProperties.tags
        && newProperties.tags.map(t => new Tag(this.client, t)),
    };

    Object.assign(this, newProperties, {
      hydrated,
      ...references,
    });
  }

  /**
   * Makes a href for a given customer code and ID
   * @param {string} customerCode Customer code
   * @param {Number} id Message ID
   * @returns {string} URI to instance of message
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/messages/${id}`,
      code: customerCode,
    };
  }

  /**
   * Fetches the data for this message via the client
   * @returns {Promise} If successful, a hydrated instance of this message
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(message => new Message(this.client, { ...this, ...message }));
  }

  /**
   * Creates a new message via the client
   * @returns {Promise} If successful, a hydrated instance of message with id
   */
  create() {
    // eslint-disable-next-line no-unused-vars
    const { client, hydrated, customerCode, ...body } = this;
    return this.client.post(`/1/${customerCode}/messages`, { body })
      .then(response => response.headers.get('location'))
      .then((href) => {
        const match = /\/\d+\/\S+\/messages\/(\d+)/.exec(href);
        return new Message(this.client, { ...this, href, id: parseFloat(match[1]) });
      });
  }


  /**
   * Updates data for a  message via the client
   * @returns {Promise} if successful returns instance of this  message
   */
  update() {
    // eslint-disable-next-line no-unused-vars
    const { client, hydrated, customerCode, ...body } = this;
    const { href } = Message.makeHref(this.customerCode, this.id);
    return this.client.put(href, { body })
      .then(() => new Message(this.client, { ...this }));
  }
}
export default Message;
