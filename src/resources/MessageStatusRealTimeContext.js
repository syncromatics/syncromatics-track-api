import RealTimeContext from './RealTimeContext';

/**
 * A real time context that can be used to generate subscriptions to Message Status entities.
 */
class MessageStatusRealTimeContext extends RealTimeContext {
  /**
   * Creates a context that can subscribe to Incident updates.
   * @param {RealTimeClient} realTimeClient  Pre-configured instance of RealTimeClient.
   * @param {string} customerCode The customer code to query for updates.
   */
  constructor(realTimeClient, customerCode) {
    const entityName = 'DISPATCH_MESSAGE_STATUSES';
    super(realTimeClient, entityName, customerCode);
  }
}

export default MessageStatusRealTimeContext;
