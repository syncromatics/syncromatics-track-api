import Resource from './Resource';
import Assignment from './Assignment';
import VehicleMedia from './VehicleMedia';

/**
 * Vehicle resource
 */
class Vehicle extends Resource {
  /**
   * Creates a new vehicle
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial vehicle data to a new instance</caption>
   * const client = new Client();
   * const partialVehicleData = {
   *   href: '/1/SYNC/vehicles/2',
   *   name: '9876',
   *   assignment: {
   *     sign_in_type: 'Dispatch',
   *   },
   * };
   * const vehicle = new Vehicle(client, partialVehicleData);
   *
   * vehicle.hydrated == true;
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, ...rest) {
    super(client);

    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href');
    const references = {
      assignment: newProperties.assignment && new Assignment(this.client, newProperties.assignment),
      media: newProperties.media && newProperties.media.map(m => new VehicleMedia(this.client, m)),
    };

    Object.assign(this, newProperties, {
      hydrated,
      ...references,
    });
  }

  /**
   * Makes a href for a given customer code and ID
   * @param {string} customerCode Customer code
   * @param {Number} id Vehicle ID
   * @returns {string} URI to instance of vehicle
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/vehicles/${id}`,
    };
  }

  /**
   * Fetches the data for this vehicle via the client
   * @returns {Promise} If successful, a hydrated instance of this vehicle
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(vehicle => new Vehicle(this.client, this, vehicle));
  }
}

export default Vehicle;
