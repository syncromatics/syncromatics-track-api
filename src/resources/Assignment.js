import Resource from './Resource';
import Vehicle from './Vehicle';
import Driver from './Driver';
import Pattern from './Pattern';
import Run from './Run';
import Trip from './Trip';

/**
 * Vehicle assignment resource
 */
class Assignment extends Resource {
  /**
   * Creates a new vehicle assignment
   *
   * Will populate itself with the values given to it after the client parameter
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, ...rest) {
    super(client);
    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href');
    const references = {
      vehicle: newProperties.vehicle && new Vehicle(this.client, newProperties.vehicle),
      driver: newProperties.driver && new Driver(this.client, newProperties.driver),
      pattern: newProperties.pattern && new Pattern(this.client, newProperties.pattern),
      run: newProperties.run && new Run(this.client, newProperties.run),
      trip: newProperties.trip && new Trip(this.client, newProperties.trip),
    };

    Object.assign(this, newProperties, {
      hydrated,
      ...references,
    });
  }

  /**
   * Makes a href for a given customer code and ID
   * @param {string} customerCode Customer code
   * @param {Number} id vehicle ID
   * @returns {{href: string}} URI to instance of assignment
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/vehicles/${id}/assignment`,
    };
  }

  makeHref() {
    return {
      href: this.vehicle ? `${this.vehicle.href}/assignment` : this.href,
    };
  }

  /**
   * Fetches the data for this assignment via the client
   * @returns {Promise} If successful, a hydrated instance of this assignment
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(assignment => new Assignment(this.client, this, assignment));
  }

  /**
   * Saves data for this assignment via the client
   * @returns {Promise} If successful, returns instance of this Assignment
   */
  update() {
    // eslint-disable-next-line no-unused-vars
    const { client, hydrated, ...body } = this;
    const { href } = this.makeHref();
    return this.client.put(href, { body })
      .then(() => new Assignment(this.client, { ...this }));
  }

  /**
   * Removes this assignment via the client
   * @returns {Promise} If successful, returns a resolved promise
   */
  delete() {
    const { href } = this.makeHref();
    return this.client.delete(href)
      .then(() => {});
  }
}

export default Assignment;
