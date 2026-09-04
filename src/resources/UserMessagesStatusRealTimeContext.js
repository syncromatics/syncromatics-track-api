import RealTimeContext from './RealTimeContext';

/**
 * A context for subscribing to the authenticated user's unread User Message counts, one entry per
 * room.
 *
 * This is the Track user-to-user equivalent of {@link DispatchMessageStatusRealTimeContext}, which
 * reports unread counts for vehicle (dispatch) messaging instead.
 *
 * The subscription is always scoped to the authenticated user - the server derives the user from
 * the connection, so there are no filters to apply. Subscribing to a specific set of rooms isn't
 * supported by the server yet.
 *
 * @example
 *   const end = await customer.realTime().userMessagesStatus()
 *     .on('update', ({ data }) => data.forEach(({ room_href, unread_count }) => {
 *       // { room_href: '/1/SYNC/room_messages/403', unread_count: 2 }
 *     }));
 */
class UserMessagesStatusRealTimeContext extends RealTimeContext {
  /**
   * @param {RealTimeClient} realTimeClient Pre-configured instance of RealTimeClient.
   * @param {string} customerCode The customer code to query for updates.
   */
  constructor(realTimeClient, customerCode) {
    super(realTimeClient, 'ROOM_MESSAGES_STATUS', customerCode);
  }
}

export default UserMessagesStatusRealTimeContext;
