import RealTimeContext from './RealTimeContext';

/**
 * A real time context that can be used to generate subscriptions to Area entities.
 */
class AreasRealTimeContext extends RealTimeContext {
  /**
   * Creates a context that can subscribe to Area updates.
   * @param {RealTimeClient} realTimeClient Pre-configured instance of RealTimeClient.
   * @param {string} customerCode The customer code to query for updates.
   */
  constructor(realTimeClient, customerCode) {
    const entityName = 'AREAS';
    super(realTimeClient, entityName, customerCode);
    this.filters = {
      areas: [],
    };
  }

  /**
   * Restrict subscriptions created by this context to a single area.
   * @param {Resource|string} area Href or resource representation of a area.
   * @returns {AreasRealTimeContext} Context with filter applied.
   */
  forArea(area) {
    return this.forAreas([area]);
  }

  /**
   * Restrict subscriptions created by this context to a set of areas.
   * @param {Array.<Resource|string>} areas Array of href or resource representations of
   * Areas.
   * @returns {AreasRealTimeContext} Context with filter applied.
   */
  forAreas(areas) {
    this.assertSubscriptionNotStarted();
    this.filters.areas = areas.map(RealTimeContext.resolveHref);
    return this;
  }
}

export default AreasRealTimeContext;
