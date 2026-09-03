import { roomsFor } from './userMessagesMockData';

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
 * NOTE: The room-messages backend doesn't exist yet. Until it does, this reports unread counts for
 * the mock rooms in ./userMessagesMockData - the same rooms UserMessagesRealTimeContext serves
 * messages for - so a UI can match counts to rooms by href before the real subscription lands.
 * When it does, this becomes a RealTimeContext over the ROOM_MESSAGES_STATUS entity, and the
 * payload shape below is what the server sends.
 *
 * @example
 *   const end = await customer.realTime().userMessagesStatus()
 *     .on('update', ({ data }) => data.forEach(({ room_href, unread_count }) => {
 *       // { room_href: '/1/SYNC/room/403/', unread_count: 2 }
 *     }));
 */
class UserMessagesStatusRealTimeContext {
  /**
   * @param {string} customerCode The customer code to query for updates.
   */
  constructor(customerCode) {
    this.customerCode = customerCode;
    this.handler = null;
  }

  /**
   * Registers a handler and delivers the initial snapshot of unread counts.
   *
   * The real subscription sends a frame per room whenever that room's count changes; the mock
   * sends only the initial snapshot, containing an entry for each room with unread messages.
   * @param {string} event The event to handle. Only "update" is supported - the server reports a
   * room falling to zero unread as an update with an unread_count of 0 rather than a delete.
   * @param {function} handler The handler function to be fired when unread counts change.
   * @returns {Promise} A promise that resolves to a function that, when called, ends the
   * subscription.
   */
  on(event, handler) {
    if (event !== 'update') {
      throw new Error('You must pass "update" as event to on');
    }
    if (typeof handler !== 'function') {
      throw new Error('You must pass a function as handler to on');
    }

    this.handler = handler;
    handler({ data: this.buildStatuses() });

    return Promise.resolve(() => {});
  }

  /**
   * Builds the unread count for every room that has unread messages.
   * @returns {Array.<Object>} Mock Room Message Statuses, in the server's payload shape.
   */
  buildStatuses() {
    return roomsFor(this.customerCode)
      .filter(room => room.unreadCount > 0)
      .map(room => ({
        unread_count: room.unreadCount,
        room_href: room.href,
      }));
  }
}

export default UserMessagesStatusRealTimeContext;
