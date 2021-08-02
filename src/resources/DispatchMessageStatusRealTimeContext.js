import RealTimeContext from './RealTimeContext';

/**
 * A real time context that can be used to generate
 * subscriptions to Dispatch Message Status entities.
 */
class DispatchMessageStatusRealTimeContext extends RealTimeContext {
  /**
   * Creates a context that can subscribe to Dispatch Message Status updates.
   * @param {RealTimeClient} realTimeClient  Pre-configured instance of RealTimeClient.
   * @param {string} customerCode The customer code to query for updates.
   */
  constructor(realTimeClient, customerCode) {
    const entityName = 'DISPATCH_MESSAGE_STATUSES';
    super(realTimeClient, entityName, customerCode);
    this.filters = {
      users: [],
    };
  }

  /**
   * Restrict subscriptions created by this context to a single user.
   * Overwrites any existing user filter for this context.
   * Cannot be called after subscription is started.
   * @param {Resource|string} user Href or resource representation of a User
   * @returns {DispatchMessagesRealTimeContext} Context with filter applied.
   */
  forUser(user) {
    return this.forUsers([user]);
  }

  /**
   * Restrict subscriptions created by this context to a set of users.
   * Overwrites any existing user filter for this context.
   * Cannot be called after subscription is started.
   * @param {Array.<Resource|string>} users Array of href or resource representations of Users.
   * @returns {DispatchMessagesRealTimeContext} Context with filter applied.
   */
  forUsers(users) {
    this.assertSubscriptionNotStarted();
    this.filters.users = users.map(RealTimeContext.resolveHref);
    return this;
  }
}

export default DispatchMessageStatusRealTimeContext;
