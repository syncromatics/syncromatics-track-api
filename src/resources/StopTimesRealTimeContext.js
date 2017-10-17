import RealTimeContext from './RealTimeContext';

/**
 * A real time context that can be used to generate subscriptions to Stop Time entities.
 */
class StopTimesRealTimeContext extends RealTimeContext {
  /**
   * Creates a context that can subscribe to Stop Time updates.
   * @param {RealTimeClient} realTimeClient Pre-configured instance of RealTimeClient.
   */
  constructor(realTimeClient) {
    const entityName = 'STOPTIMES';
    super(realTimeClient, entityName);
    this.filters = {
      stops: [],
      trips: [],
      vehicles: [],
    };
  }

  /**
   * Restrict subscriptions created by this context to a single stop.
   * @param {Resource|string} stop Href or resource representation of a stop.
   * @returns {StopTimesRealTimeContext} Context with filter applied.
   */
  forStop(stop) {
    return this.forStops([stop]);
  }

  /**
   * Restrict subscriptions created by this context to a set of stops.
   * @param {Array.<Resource|string>} stops Array of href or resource representations of
   * stops.
   * @returns {StopTimesRealTimeContext} Context with filter applied.
   */
  forStops(stops) {
    this.assertSubscriptionNotStarted();
    this.filters.stops = stops.map(RealTimeContext.resolveHref);
    return this;
  }

  /**
   * Restrict subscriptions created by this context to a single trip.
   * @param {Resource|string} trip Href or resource representation of a trip.
   * @returns {StopTimesRealTimeContext} Context with filter applied.
   */
  forTrip(trip) {
    return this.forTrips([trip]);
  }

  /**
   * Restrict subscriptions created by this context to a set of trips.
   * @param {Array.<Resource|string>} trips Array of href or resource representations of
   * trips.
   * @returns {StopTimesRealTimeContext} Context with filter applied.
   */
  forTrips(trips) {
    this.assertSubscriptionNotStarted();
    this.filters.trips = trips.map(RealTimeContext.resolveHref);
    return this;
  }

  /**
   * Restrict subscriptions created by this context to a single vehicle.
   * @param {Resource|string} vehicle Href or resource representation of a vehicle.
   * @returns {StopTimesRealTimeContext} Context with filter applied.
   */
  forVehicle(vehicle) {
    return this.forVehicles([vehicle]);
  }

  /**
   * Restrict subscriptions created by this context to a set of vehicles.
   * @param {Array.<Resource|string>} vehicles Array of href or resource representations of
   * Vehicles.
   * @returns {StopTimesRealTimeContext} Context with filter applied.
   */
  forVehicles(vehicles) {
    this.assertSubscriptionNotStarted();
    this.filters.vehicles = vehicles.map(RealTimeContext.resolveHref);
    return this;
  }
}

export default StopTimesRealTimeContext;
