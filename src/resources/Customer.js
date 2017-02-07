import Resource from './Resource';
import VehiclesContext from './VehiclesContext';
import Vehicle from './Vehicle';

/**
 * Customer resource
 *
 * This acts as the context for accessing all customer-specific data.
 */
class Customer extends Resource {
  /**
   * Creates a new resource
   * @param {Client} client Instance of pre-configured client
   * @param {string} customerCode Customer code
   */
  constructor(client, customerCode) {
    super(client);

    /**
     * Customer code
     * @instance
     */
    this.code = customerCode;
  }

  /**
   * Gets a context for querying this customer's vehicles
   * @returns {VehicleContext} Context for querying this customer's vehicles
   */
  vehicles() {
    return this.resource(VehiclesContext, this.code);
  }

  /**
   * Gets a vehicle resource by id
   * @param {Number} id Identity of the vehicle
   * @returns {Vehicle} Vehicle resource
   */
  vehicle(id) {
    return this.resource(Vehicle, Vehicle.makeHref(this.code, id));
  }
}

export default Customer;
