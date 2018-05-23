import RealTimeContext from './RealTimeContext';

/**
 * A real-time context that can be used to generate subscriptions to Signs
 */
class SignsRealTimeContext extends RealTimeContext {
  /**
   * Creates a context that can subscribe to Signs updates.
   * @param {RealTimeClient} realTimeClient  Pre-configured instance of RealTimeClient
   * @param {string} customerCode Alpha-numeric code of the customer
   */
  constructor(realTimeClient, customerCode) {
    const entityName = 'SIGNS';
    super(realTimeClient, entityName, customerCode);
    this.filters = {
      signs: [],
    };
  }

  /**
   * Restrict subscriptions created by this context to a single sign.
   * Overwrites any existing sign filter for this context.
   * Cannot be called after subscription is started.
   * @param {Resource|string} sign Href or resource representation of a Sign
   * @returns {SignsRealTimeContext} Context with filter applied.
   */
  forSign(sign) {
    return this.forSigns([sign]);
  }

  /**
   * Restrict subscriptions created by this context to a set of signs.
   * Overwrites any existing sign filter for this context.
   * Cannot be called after subscription is started.
   * @param {Array.<Resource|string>} signs Array of href or resource representations of Signs.
   * @returns {SignsRealTimeContext} Context with filter applied.
   */
  forSigns(signs) {
    this.assertSubscriptionNotStarted();
    this.filters.signs = signs.map(RealTimeContext.resolveHref);
    return this;
  }
}

export default SignsRealTimeContext;
