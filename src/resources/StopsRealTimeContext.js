import RealTimeContext from './RealTimeContext';

/**
 * A real time context that can be used to generate subscriptions to Stop entities.
 */
class StopsRealTimeContext extends RealTimeContext {
  /**
   * Creates a context that can subscribe to Stop updates.
   * @param {RealTimeClient} realTimeClient Pre-configured instance of RealTimeClient.
   * @param {string} customerCode The customer code to query for updates.
   */
  constructor(realTimeClient, customerCode) {
    const entityName = 'STOPS';
    super(realTimeClient, entityName, customerCode);
    this.filters = {
      stops: [],
    };
  }

  /**
   * Restrict subscriptions created by this context to a single stop.
   * @param {Resource|string} stop Href or resource representation of a Stop.
   * @returns {StopsRealTimeContext} Context with filter applied.
   */
  forStop(stop) {
    return this.forStops([stop]);
  }

  /**
   * Restrict subscriptions created by this context to a set of stops.
   * @param {Array.<Resource|string>} stops Array of href or resource representations of
   * Stops.
   * @returns {StopsRealTimeContext} Context with filter applied.
   */
  forStops(stops) {
    this.assertSubscriptionNotStarted();
    this.filters.stops = stops.map(RealTimeContext.resolveHref);
    return this;
  }
}

export default StopsRealTimeContext;
