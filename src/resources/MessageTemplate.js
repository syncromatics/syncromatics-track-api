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
  constructor(client, ...rest) {
    super(client);

    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href');
    const references = {
      sign_messages: newProperties.sign_messages && new SignMessage(this.client, newProperties.sign_messages),
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
    };
  }

  /**
   * Fetches the data for this messageTemplate via the client
   * @returns {Promise} If successful, a hydrated instance of this messageTemplate
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(messageTemplate => new MessageTemplate(this.client, this, messageTemplate));
  }
}

export default MessageTemplate;
