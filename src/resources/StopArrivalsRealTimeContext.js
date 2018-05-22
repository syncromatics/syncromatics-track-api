import RealTimeContext from './RealTimeContext';

/**
 * A real-time context that can be used to generate subscriptions to arrivals for stops
 */
class StopArrivalsRealTimeContext extends RealTimeContext {
  /**
   * Creates a context that can subscribe to StopArrival updates.
   * @param {RealTimeClient} realTimeClient Pre-configured instance of RealTimeClient
   * @param {string} customerCode Alphanumeric code of the customer
   */
  constructor(realTimeClient, customerCode) {
    const entityName = 'STOP_ARRIVALS';
    super(realTimeClient, entityName, customerCode);
    this.filters = {
      stops: [],
    };
  }

  /**
   * Restrict subscriptions created by this context to a single stop.
   * Overwrites any existing stop filter for this context.
   * Cannot be called after subscription is started.
   * @param {Resource|string} stop Href or resource representation of a Stop
   * @returns {StopArrivalsRealTimeContext} Context with filter applied.
   */
  forStop(stop) {
    return this.forStops([stop]);
  }

  /**
   * Restrict subscriptions created by this context to a set of Stops.
   * Overwrites any existing stop filter for this context.
   * Cannot be called after subscription is started.
   * @param {Array.<Resource|string>} stops Array of href or resource representations of Stops.
   * @returns {StopArrivalsRealTimeContext} Context with filter applied.
   */
  forStops(stops) {
    this.assertSubscriptionNotStarted();
    this.filters.stops = stops.map(RealTimeContext.resolveHref);
    return this;
  }
}

export default StopArrivalsRealTimeContext;
