import RealTimeContext from './RealTimeContext';

/**
 * A real time context that can be used to generate subscriptions to Call State entities.
 */
class CallStatesRealTimeContext extends RealTimeContext {
  /**
   * Creates a context that can subscribe to Call State updates.
   * @param {RealTimeClient} realTimeClient  Pre-configured instance of RealTimeClient.
   * @param {string} customerCode The customer code to query for updates.
   */
  constructor(realTimeClient, customerCode) {
    const entityName = 'CALL_STATES';
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
   * @returns {CallStatesRealTimeContext} Context with filter applied.
   */
  forVehicle(vehicle) {
    return this.forVehicles([vehicle]);
  }

  /**
   * Restrict subscriptions created by this context to a set of vehicles.
   * Vehicle restrictions are independent of user subscriptions.
   * @param {Array.<Resource|string>} vehicles Array of href or resource representations of
   * Vehicles.
   * @returns {CallStatesRealTimeContext} Context with filter applied.
   */
  forVehicles(vehicles) {
    this.assertSubscriptionNotStarted();
    this.filters.vehicles = vehicles.map(RealTimeContext.resolveHref);
    return this;
  }

  /**
   * Restrict subscriptions created by this context to a single user.
   * User restrictions are independent of vehicle subscriptions.
   * @param {Resource|string} user Href or resource representation of a Vehicle.
   * @returns {CallStatesRealTimeContext} Context with filter applied.
   */
  forUser(user) {
    return this.forUsers([user]);
  }

  /**
   * Restrict subscriptions created by this context to a set of users.
   * User restrictions are independent of vehicle subscriptions.
   * @param {Array.<Resource|string>} users Array of href or resource representations of Users.
   * @returns {CallStatesRealTimeContext} Context with filter applied.
   */
  forUsers(users) {
    this.assertSubscriptionNotStarted();
    this.filters.users = users.map(RealTimeContext.resolveHref);
    return this;
  }
}

export default CallStatesRealTimeContext;
