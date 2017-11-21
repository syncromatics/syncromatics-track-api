import Resource from './Resource';
import Trip from './Trip';

/**
 * Run resource
 */
class Run extends Resource {
  /**
   * Creates a new Run resource object
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial run data to a new instance</caption>
   * const client = new Client();
   * const partialRunData = {
   *   href: '/1/SYNC/runs/1',
   *   name: 'Scheduled Run',
   *   short_name: 'R01',
   * };
   * const run = new Run(client, partialRunData);
   *
   * run.hydrated == true;
   *
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, ...rest) {
    super(client);

    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href');
    const references = {
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
   * @param {Number} id Run ID
   * @returns {{href: string}} URI to instance of run
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/runs/${id}`,
    };
  }

  /**
   * Fetches the data for this run via the client
   * @returns {Promise} If successful, a hydrated instance of this run
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(run => new Run(this.client, this, run));
  }
}

export default Run;
