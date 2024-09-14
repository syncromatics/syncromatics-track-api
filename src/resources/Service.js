import Resource from './Resource';
import Block from './Block';
import Run from './Run';
import Trip from './Trip';


/**
 * Service resource
 */
class Service extends Resource {
  /**
   * Creates a new Service resource object
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial Service data to a new instance</caption>
   * const client = new Client();
   * const partialServiceData = {
   *   href: '/1/SYNC/services/1',
   *   id: 1,
   *   start: new Date(2017-01-01T00:00:00.000-0700),
   *   end: '2017-01-01T00:00:00.000-0700'
   * };
   * const service = new Service(client, partialServiceData);
   *
   * service.hydrated === true;
   *
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, ...rest) {
    super(client);

    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href');
    const references = {
      blocks: newProperties.blocks && newProperties.blocks.map(b => new Block(this.client, b)),
      runs: newProperties.runs && newProperties.runs.map(r => new Run(this.client, r)),
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
   * @param {Number} id Service ID
   * @returns {{href: string}} URI to instance of Service
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/services/${id}`,
    };
  }

  /**
   * Fetches the data for this service via the client
   * @returns {Promise} If successful, a hydrated instance of this Service
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(service => new Service(this.client, this, service));
  }
}

export default Service;
