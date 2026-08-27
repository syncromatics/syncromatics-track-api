import RealTimeContext from './RealTimeContext';

/**
 * A real time context that can be used to generate subscriptions to Dispatch Chat messages -
 * ad-hoc conversations between dispatchers (e.g. "dispatch/messages/abc-123"). This is separate
 * from DispatchMessagesRealTimeContext, which handles messages sent between dispatch and drivers.
 */
class DispatchChatRealTimeContext extends RealTimeContext {
  /**
   * Creates a context that can subscribe to Dispatch Chat message updates.
   * @param {RealTimeClient} realTimeClient Pre-configured instance of RealTimeClient.
   * @param {string} customerCode The customer code to query for updates.
   */
  constructor(realTimeClient, customerCode) {
    const entityName = 'DISPATCH_CHAT';
    super(realTimeClient, entityName, customerCode);
    this.filters = {
      rooms: [],
    };
  }

  /**
   * Restrict subscriptions created by this context to a single chat room.
   * Overwrites any existing room filter for this context.
   * Cannot be called after subscription is started.
   * @param {Resource|string} room Href or resource representation of a chat room.
   * @returns {DispatchChatRealTimeContext} Context with filter applied.
   */
  forRoom(room) {
    return this.forRooms([room]);
  }

  /**
   * Restrict subscriptions created by this context to a set of chat rooms.
   * Overwrites any existing room filter for this context.
   * Cannot be called after subscription is started.
   * @param {Array.<Resource|string>} rooms Array of href or resource representations of chat
   * rooms.
   * @returns {DispatchChatRealTimeContext} Context with filter applied.
   */
  forRooms(rooms) {
    this.assertSubscriptionNotStarted();
    this.filters.rooms = rooms.map(RealTimeContext.resolveHref);
    return this;
  }
}

export default DispatchChatRealTimeContext;
