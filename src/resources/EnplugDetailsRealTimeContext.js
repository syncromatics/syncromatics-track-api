import RealTimeContext from './RealTimeContext';

/**
 * A real-time context that can be used to generate subscriptions to enplug details for vehicles
 */
class EnplugDetailsRealTimeContext extends RealTimeContext {
  /**
   * Creates a context that can subscribe to updates for EnplugDetails.
   * @param {RealTimeClient} realTimeClient Pre-configured instance of RealTimeClient
   * @param {string} customerCode Alphanumeric code of the customer
   */
  constructor(realTimeClient, customerCode) {
    const entityName = 'ENPLUG_DETAILS';
    super(realTimeClient, entityName, customerCode);
    this.filters = {
      vehicles: [],
    };
  }

  /**
   * Restrict subscriptions created by this context to a single vehicle.
   * Overwrites any existing vehicle filter for this context.
   * Cannot be called after subscription is started.
   * @param {Resource|string} vehicle Href or resource representation of a Vehicle
   * @returns {EnplugDetailsRealTimeContext} Context with filter applied.
   */
  forVehicle(vehicle) {
    return this.forVehicles([vehicle]);
  }

  /**
   * Restrict subscriptions created by this context to a set of Vehicles.
   * Overwrites any existing vehicle filter for this context.
   * Cannot be called after subscription is started.
   * @param {Array.<Resource|string>} vehicles Array of href or resource representations of
   *  Vehicles.
   * @returns {EnplugDetailsRealTimeContext} Context with filter applied.
   */
  forVehicles(vehicles) {
    this.assertSubscriptionNotStarted();
    this.filters.vehicles = vehicles.map(RealTimeContext.resolveHref);
    return this;
  }
}

export default EnplugDetailsRealTimeContext;
