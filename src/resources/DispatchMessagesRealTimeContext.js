import RealTimeContext from './RealTimeContext';

/**
 * A real-time context that can be used to generate subscriptions to Dispatch Messages
 */
class DispatchMessagesRealTimeContext extends RealTimeContext {
  /**
   * Creates a context that can subscribe to DispatchMessage updates.
   * @param {RealTimeClient} realTimeClient  Pre-configured instance of RealTimeClient
   * @param {string} customerCode Alpha-numeric code of the customer
   */
  constructor(realTimeClient, customerCode) {
    const entityName = 'DISPATCH_MESSAGES';
    super(realTimeClient, entityName, customerCode);
    this.filters = {
      drivers: [],
    };
  }

  /**
   * Restrict subscriptions created by this context to a single driver.
   * Overwrites any existing driver filter for this context.
   * Cannot be called after subscription is started.
   * @param {Resource|string} driver Href or resource representation of a Driver
   * @returns {DispatchMessagesRealTimeContext} Context with filter applied.
   */
  forDriver(driver) {
    return this.forDrivers([driver]);
  }

  /**
   * Restrict subscriptions created by this context to a set of drivers.
   * Overwrites any existing driver filter for this context.
   * Cannot be called after subscription is started.
   * @param {Array.<Resource|string>} drivers Array of href or resource representations of Drivers.
   * @returns {DispatchMessagesRealTimeContext} Context with filter applied.
   */
  forDrivers(drivers) {
    this.assertSubscriptionNotStarted();
    this.filters.drivers = drivers.map(RealTimeContext.resolveHref);
    return this;
  }
}

export default DispatchMessagesRealTimeContext;
