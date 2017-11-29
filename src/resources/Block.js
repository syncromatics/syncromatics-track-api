import Resource from './Resource';
import Service from './Service';
import Trip from './Trip';

/**
 * Block resource
 */
class Block extends Resource {
  /**
   * Creates a new Block resource object
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial block data to a new instance</caption>
   * const client = new Client();
   * const partialBlockData = {
   *   href: '/1/SYNC/blocks/1',
   *   name: 'Scheduled Block',
   *   short_name: 'B01',
   * };
   * const block = new Block(client, partialBlockData);
   *
   * block.hydrated == true;
   *
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, ...rest) {
    super(client);

    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href');
    const references = {
      service: newProperties.service && new Service(this.client, newProperties.service),
      trips: newProperties.trips && newProperties.trips.map(t => new Trip(this.client, t)),
    };

    Object.assign(this, newProperties, {
      hydrated,
      ...references,
    });
  }

  /**
   * Makes a href for a given customer code and ID
   * @param {string} customerCode Customer code
   * @param {Number} id Block ID
   * @returns {{href: string}} URI to instance of block
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/blocks/${id}`,
    };
  }

  /**
   * Fetches the data for this block via the client
   * @returns {Promise} If successful, a hydrated instance of this block
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(block => new Block(this.client, this, block));
  }
}

export default Block;
