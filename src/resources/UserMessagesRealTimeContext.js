import RealTimeContext from './RealTimeContext';
import {
  you,
  roomsFor,
  findRoom,
  messageHrefFor,
} from './userMessagesMockData';

const DEFAULT_MILLISECONDS_BETWEEN_MESSAGES = 10000;

/**
 * A context for subscribing to User Messages - ad-hoc conversations between Track users.
 *
 * Subscribe without naming a room to get an inbox: the most recent message or two from every room
 * the user is in, delivered in a single frame. Subscribe to one room with forRoom() to get that
 * room's conversation, which then plays out message by message.
 *
 * NOTE: The User Messages backend doesn't exist yet. Until it does, this plays back the mock rooms
 * in ./userMessagesMockData, so callers can build and use the real interface (forRoom(),
 * on('update', handler), and the unsubscribe function it resolves to) now, unchanged, once real
 * messages are wired up behind it. The unread counts from UserMessagesStatusRealTimeContext are
 * built from the same rooms, so the two line up.
 */
class UserMessagesRealTimeContext {
  /**
   * @param {string} customerCode The customer code to query for updates.
   */
  constructor(customerCode) {
    this.customerCode = customerCode;
    this.roomHref = null;
    this.millisecondsBetweenMessages = DEFAULT_MILLISECONDS_BETWEEN_MESSAGES;
    this.handler = null;
    this.lastId = 0;
  }

  /**
   * Restrict subscriptions created by this context to a single chat room.
   * @param {Resource|string} room Href or resource representation of a chat room.
   * @returns {UserMessagesRealTimeContext} Context with filter applied.
   */
  forRoom(room) {
    this.roomHref = RealTimeContext.resolveHref(room);
    return this;
  }

  /**
   * Registers a handler and starts delivering messages.
   *
   * With no room filter, the handler fires once with an inbox frame - a message or two from each
   * room - and nothing further arrives. With a room filter, the handler fires with the start of
   * that room's conversation and then once per message as the conversation continues.
   * @param {string} event The event to handle. Only "update" is supported.
   * @param {function} handler The handler function to be fired when new messages arrive.
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

    if (!this.roomHref) {
      handler({ data: this.buildInbox() });
      return Promise.resolve(() => {});
    }

    const messages = this.buildMessages();
    handler({ data: messages.slice(0, 3) });

    let nextIndex = 3;
    const interval = setInterval(() => {
      if (nextIndex >= messages.length) {
        clearInterval(interval);
        return;
      }
      handler({ data: [messages[nextIndex]] });
      nextIndex += 1;
    }, this.millisecondsBetweenMessages);

    return Promise.resolve(() => clearInterval(interval));
  }

  /**
   * Sends a new message to the room and delivers it to the active subscriber, as if it had come
   * back from the server.
   * @param {string} message Text of the message to send.
   * @returns {Promise} If successful, the sent message.
   */
  send(message) {
    if (typeof this.handler !== 'function') {
      return Promise.reject(new Error('You must call on("update", handler) before sending a message.'));
    }
    if (!this.roomHref) {
      return Promise.reject(new Error('You must call forRoom before sending a message.'));
    }

    this.lastId += 1;
    const sentMessage = {
      id: this.lastId,
      customerId: 1,
      authorFirstName: you.authorFirstName,
      authorLastName: you.authorLastName,
      authorHref: you.authorHref,
      roomHref: this.roomHref,
      message,
      seenTime: null,
      sentTime: new Date().toISOString(),
      platformType: you.platformType,
      href: messageHrefFor(this.roomHref, this.lastId),
    };

    this.handler({ data: [sentMessage] });
    return Promise.resolve(sentMessage);
  }

  /**
   * Marks a list of messages as read.
   * @param {Array.<Resource|string>} messages Messages to mark as read
   * @returns {Promise} Immediately-resolved promise
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  markMessagesRead(messages) {
    return Promise.resolve();
  }

  /**
   * Builds one message.
   * @param {Object} options The message's parts.
   * @param {Object} options.room The room the message belongs to.
   * @param {Object} options.line The scripted line, with its author and text.
   * @param {number} options.id The message's id.
   * @param {number} options.sentTime Epoch milliseconds the message was sent at.
   * @param {boolean} options.seen Whether the message has been seen by the authenticated user.
   * @returns {Object} A mock User Message.
   */
  // eslint-disable-next-line class-methods-use-this
  buildMessage({
    room, line, id, sentTime, seen,
  }) {
    const author = line.fromYou ? you : room.participant;
    return {
      id,
      customerId: 1,
      authorFirstName: author.authorFirstName,
      authorLastName: author.authorLastName,
      authorHref: author.authorHref,
      roomHref: room.href,
      message: line.message,
      seenTime: seen ? new Date(sentTime + 1000).toISOString() : null,
      sentTime: new Date(sentTime).toISOString(),
      platformType: author.platformType,
      href: messageHrefFor(room.href, id),
    };
  }

  /**
   * Builds the inbox frame - the tail of every room's conversation, oldest room first. Messages
   * that make up a room's unread count come back with a null seenTime, so the unread counts
   * reported by User Messages Status match what the UI has in hand.
   * @returns {Array.<Object>} Mock User Messages across all rooms.
   */
  buildInbox() {
    const baseTime = Date.now();
    let id = 0;

    const messages = roomsFor(this.customerCode).reduce((all, room) => {
      const preview = room.conversation.slice(0, room.previewCount);
      const unreadFrom = preview.length - room.unreadCount;

      const roomMessages = preview.map((line, index) => {
        id += 1;
        return this.buildMessage({
          room,
          line,
          id,
          // stagger the rooms into the recent past so the inbox looks like history
          sentTime: baseTime - ((preview.length - index) * this.millisecondsBetweenMessages),
          seen: line.fromYou || index < unreadFrom,
        });
      });

      return all.concat(roomMessages);
    }, []);

    this.lastId = id;
    return messages;
  }

  /**
   * Builds the conversation for the room this context is filtered to. An href that isn't one of
   * the mock rooms still gets a conversation, so any room href can be subscribed to.
   * @returns {Array.<Object>} Ordered list of mock User Messages.
   */
  buildMessages() {
    const rooms = roomsFor(this.customerCode);
    const matched = findRoom(this.customerCode, this.roomHref);
    const room = {
      ...(matched || rooms[0]),
      href: this.roomHref,
    };

    const baseTime = Date.now();
    const messages = room.conversation.map((line, index) => this.buildMessage({
      room,
      line,
      id: index + 1,
      sentTime: baseTime + (index * this.millisecondsBetweenMessages),
      seen: false,
    }));

    this.lastId = messages.length;
    return messages;
  }
}

export default UserMessagesRealTimeContext;
