import RealTimeContext from './RealTimeContext';

/**
 * A real time context that can be used to generate subscriptions to Vehicle entities.
 */
class VehiclesRealTimeContext extends RealTimeContext {
  /**
   * Creates a context that can subscribe to Vehicle updates.
   * @param {RealTimeClient} realTimeClient Pre-configured instance of RealTimeClient.
   * @param {string} customerCode The customer code to query for updates.
   */
  constructor(realTimeClient, customerCode) {
    const entityName = 'VEHICLES';
    super(realTimeClient, entityName, customerCode);
    this.filters = {
      vehicles: [],
    };
  }

  /**
   * Restrict subscriptions created by this context to a single vehicle.
   * @param {Resource|string} vehicle Href or resource representation of a vehicle.
   * @returns {VehiclesRealTimeContext} Context with filter applied.
   */
  forVehicle(vehicle) {
    return this.forVehicles([vehicle]);
  }

  /**
   * Restrict subscriptions created by this context to a set of vehicles.
   * @param {Array.<Resource|string>} vehicles Array of href or resource representations of
   * Vehicles.
   * @returns {VehiclesRealTimeContext} Context with filter applied.
   */
  forVehicles(vehicles) {
    this.assertSubscriptionNotStarted();
    this.filters.vehicles = vehicles.map(RealTimeContext.resolveHref);
    return this;
  }
}

export default VehiclesRealTimeContext;
