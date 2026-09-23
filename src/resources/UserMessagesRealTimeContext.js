import RealTimeContext from './RealTimeContext';

/**
 * A context for subscribing to User Messages - ad-hoc conversations between Track users.
 *
 * Subscribe without naming a room to receive messages for every room belonging to the customer,
 * or restrict the subscription with forRoom() or forRooms().
 */
class UserMessagesRealTimeContext extends RealTimeContext {
  /**
   * @param {RealTimeClient} realTimeClient Pre-configured instance of RealTimeClient.
   * @param {string} customerCode The customer code to query for updates.
   * @param {Object} [options={}] Options for creating and sending User Messages.
   * @param {number} [options.platformType] Platform creating messages: 1 Mobile or 2 Web.
   */
  constructor(realTimeClient, customerCode, options = {}) {
    super(realTimeClient, 'ROOM_MESSAGES', customerCode);
    this.filters = { rooms: [] };
    this.platformType = options.platformType;

    if (this.platformType !== undefined && ![1, 2].includes(this.platformType)) {
      throw new Error('platformType must be either 1 (Mobile) or 2 (Web).');
    }
  }

  /**
   * Restrict subscriptions created by this context to a single chat room.
   * @param {Resource|string} room Href or resource representation of a chat room.
   * @returns {UserMessagesRealTimeContext} Context with filter applied.
   */
  forRoom(room) {
    return this.forRooms([room]);
  }

  /**
   * Restrict subscriptions created by this context to a set of chat rooms.
   * @param {Array.<Resource|string>} rooms Room hrefs or resource representations.
   * @returns {UserMessagesRealTimeContext} Context with filters applied.
   */
  forRooms(rooms) {
    this.assertSubscriptionNotStarted();
    if (!Array.isArray(rooms)) {
      throw new Error('forRooms requires an array of room hrefs or Resources.');
    }
    this.filters.rooms = rooms.map(RealTimeContext.resolveHref);
    return this;
  }

  /**
   * Sends a new message to the single room selected with forRoom().
   * @param {string} message Text of the message to send.
   * @returns {Promise} If successful, the server's newly-created message.
   */
  send(message) {
    if (this.filters.rooms.length !== 1) {
      return Promise.reject(new Error('You must call forRoom before sending a message.'));
    }
    if (![1, 2].includes(this.platformType)) {
      return Promise.reject(new Error('You must configure platformType before sending a message.'));
    }

    const roomHref = this.filters.rooms[0].replace(/\/+$/, '');
    const roomIdMatch = /\/room_messages\/(\d+)$/.exec(roomHref);
    if (!roomIdMatch) {
      return Promise.reject(new Error('Room href must end with /room_messages/{roomId}.'));
    }

    const uri = this.realTimeClient.client.resolve(
      `/1/${this.customerCode}/room_messages`,
      {
        roomId: parseFloat(roomIdMatch[1]),
        message,
        platformType: this.platformType,
      },
    );

    return this.realTimeClient.client.post(uri)
      .then(response => response.json());
  }

  /**
   * Marks a list of messages as read for the authenticated user.
   * @param {Array.<number>} messageIds IDs of messages to mark as read.
   * @returns {Promise} If successful, the read-receipt response.
   */
  markMessagesRead(messageIds) {
    if (!Array.isArray(messageIds) || messageIds.some(id => typeof id !== 'number')) {
      return Promise.reject(new Error('markMessagesRead requires an array of numeric message IDs.'));
    }

    return this.realTimeClient.client.post(
      `/1/${this.customerCode}/room_messages/read-receipts`,
      { body: messageIds },
    );
  }
}

export default UserMessagesRealTimeContext;
