import Resource from './Resource';
import SignMessage from './SignMessage';
/**
 * MessageTemplate resource
 */
class MessageTemplate extends Resource {
  /**
   * Creates a new message template
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial messageTemplate data to a new instance</caption>
   * const client = new Client();
   * const partialMessageTemplateData = {
   *   href: '/1/SYNC/message_templates/1',
   *   name: '5k Detour',
   *   text: 'Due to the 5k Race...',
   * };
   * const messageTemplate = new MessageTemplate(client, partialMessageTemplateData);
   *
   * messageTemplate.hydrated == true;
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, rest) {
    super(client);
    const { code, ...newProperties } = rest;
    this.customerCode = code;
    const hydrated = !Object.keys(newProperties).every(k => k === 'href' || k === 'customerCode');
    const references = {
      sign_messages: newProperties.sign_messages
        && newProperties.sign_messages.map(sm => new SignMessage(this.client, sm)),
    };

    Object.assign(this, newProperties, {
      hydrated,
      ...references,
    });
  }

  /**
   * Makes a href for a given customer code and ID
   * @param {string} customerCode Customer code
   * @param {Number} id MessageTemplate ID
   * @returns {string} URI to instance of messageTemplate
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/message_templates/${id}`,
      code: customerCode,
    };
  }

  /**
   * Fetches the data for this messageTemplate via the client
   * @returns {Promise} If successful, a hydrated instance of this messageTemplate
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(messageTemplate => new MessageTemplate(this.client, { ...this, ...messageTemplate }));
  }

/**
 * Creates a new message template via the client
 * @returns {Promise} If successful, a hydrated instance of message template with id
 */
  create() {
    // eslint-disable-next-line no-unused-vars
    const { client, hydrated, customerCode, ...body } = this;
    return this.client.post(`/1/${customerCode}/message_templates`, { body })
      .then(response => response.headers.get('location'))
      .then((href) => {
        const match = /\/\d+\/\S+\/message_templates\/(\d+)/.exec(href);
        return new MessageTemplate(this.client, { ...this, href, id: parseFloat(match[1]) });
      });
  }


  /**
   * Updates data for a  message template via the client
   * @returns {Promise} if successful returns instance of this  message template
   */
  update() {
    // eslint-disable-next-line no-unused-vars
    const { client, hydrated, customerCode, ...body } = this;
    const { href } = MessageTemplate.makeHref(this.customerCode, this.id);
    return this.client.put(href, { body })
      .then(() => new MessageTemplate(this.client, { ...this }));
  }
}
export default MessageTemplate;
