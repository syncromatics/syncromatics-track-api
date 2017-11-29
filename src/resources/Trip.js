import Resource from './Resource';
import Block from './Block';
import Pattern from './Pattern';
import Run from './Run';
import Service from './Service';

/**
 * Trip resource
 */
class Trip extends Resource {
  /**
   * Creates a new trip.
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial trip data to a new instance</caption>
   * const client = new Client();
   * const partialTripData = {
   *   href: '/1/SYNC/trips/1',
   *   id: 1,
   *   name: 'T01',
   *   order: 1,
   * };
   * const trip = new Trip(client, partialTripData);
   *
   * trip.hydrated == true;
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, ...rest) {
    super(client);

    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href');
    const references = {
      block: newProperties.block && new Block(this.client, newProperties.block),
      pattern: newProperties.pattern && new Pattern(this.client, newProperties.pattern),
      runs: newProperties.runs && newProperties.runs.map(r => new Run(this.client, r)),
      service: newProperties.service && new Service(this.client, newProperties.service),
    };

    Object.assign(this, newProperties, {
      hydrated,
      ...references,
    });
  }

  /**
   * Makes a href for a given customer code and ID
   * @param {string} customerCode Customer code
   * @param {Number} id Trip ID
   * @returns {{href: string}} URI to instance of trip
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/trips/${id}`,
    };
  }

  /**
   * Fetches the data for this trip via the client
   * @returns {Promise} If successful, a hydrated instance of this trip
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(trip => new Trip(this.client, this, trip));
  }
}

export default Trip;
