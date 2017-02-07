import Resource from './Resource';
import Vehicle from './Vehicle';

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
    };

    Object.assign(this, newProperties, {
      hydrated,
      ...references,
    });
  }
}

export default Assignment;
