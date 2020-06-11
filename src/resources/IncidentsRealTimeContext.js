import RealTimeContext from './RealTimeContext';

/**
 * A real time context that can be used to generate subscriptions to Incident entities.
 */
class IncidentsRealTimeContext extends RealTimeContext {
  /**
   * Creates a context that can subscribe to Incident updates.
   * @param {RealTimeClient} realTimeClient  Pre-configured instance of RealTimeClient.
   * @param {string} customerCode The customer code to query for updates.
   */
  constructor(realTimeClient, customerCode) {
    const entityName = 'INCIDENTS';
    super(realTimeClient, entityName, customerCode);
    this.filters = {
      vehicles: [],
      users: [],
    };
  }

  /**
   * Restrict subscriptions created by this context to a single vehicle.
   * Vehicle restrictions are independent of user subscriptions.
   * @param {Resource|string} vehicle Href or resource representation of a Vehicle.
   * @returns {IncidentsRealTimeContext} Context with filter applied.
   */
  forVehicle(vehicle) {
    return this.forVehicles([vehicle]);
  }

  /**
   * Restrict subscriptions created by this context to a set of vehicles.
   * Vehicle restrictions are independent of user subscriptions.
   * @param {Array.<Resource|string>} vehicles Array of href or resource representations of
   * Vehicles.
   * @returns {IncidentsRealTimeContext} Context with filter applied.
   */
  forVehicles(vehicles) {
    this.assertSubscriptionNotStarted();
    this.filters.vehicles = vehicles.map(RealTimeContext.resolveHref);
    return this;
  }
}

export default IncidentsRealTimeContext;
