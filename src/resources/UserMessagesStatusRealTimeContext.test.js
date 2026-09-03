import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import UserMessagesStatusRealTimeContext from './UserMessagesStatusRealTimeContext';
import UserMessagesRealTimeContext from './UserMessagesRealTimeContext';

chai.should();
chai.use(chaiAsPromised);

describe('When subscribing to User Messages Status', () => {
  const customerCode = 'SYNC';

  it('immediately receives an unread count for every room with unread messages', () => {
    const subject = new UserMessagesStatusRealTimeContext(customerCode);

    let resolver;
    const updateReceived = new Promise((resolve) => { resolver = resolve; });

    const subscription = subject.on('update', resolver);

    return Promise.all([
      subscription,
      updateReceived.then((message) => {
        message.data.should.have.length.of.at.least(2);
        message.data.forEach((status) => {
          status.should.have.all.keys(['unread_count', 'room_href']);
          status.unread_count.should.be.above(0);
          status.room_href.should.contain(`/1/${customerCode}/room/`);
        });
      }),
    ]);
  });

  it('reports counts for rooms that User Messages also delivers messages for', () => {
    const statusContext = new UserMessagesStatusRealTimeContext(customerCode);
    const messagesContext = new UserMessagesRealTimeContext(customerCode);

    const inboxRooms = [];
    const unreadRooms = [];

    return Promise.all([
      messagesContext.on('update', ({ data }) => {
        data.forEach(message => inboxRooms.push(message.roomHref));
      }),
      statusContext.on('update', ({ data }) => {
        data.forEach(status => unreadRooms.push(status.room_href));
      }),
    ]).then(() => {
      unreadRooms.should.have.length.of.at.least(2);
      unreadRooms.forEach((roomHref) => {
        inboxRooms.should.contain(roomHref);
      });
    });
  });

  it('reports a count matching the unread messages the inbox delivers for that room', () => {
    const statusContext = new UserMessagesStatusRealTimeContext(customerCode);
    const messagesContext = new UserMessagesRealTimeContext(customerCode);

    const inbox = [];
    let statuses = [];

    return Promise.all([
      messagesContext.on('update', ({ data }) => inbox.push(...data)),
      statusContext.on('update', ({ data }) => { statuses = data; }),
    ]).then(() => {
      statuses.forEach(({ room_href: roomHref, unread_count: unreadCount }) => {
        const unseen = inbox
          .filter(message => message.roomHref === roomHref)
          .filter(message => message.seenTime === null);

        unseen.should.have.lengthOf(unreadCount);
      });
    });
  });

  it('can unsubscribe', () => {
    const subject = new UserMessagesStatusRealTimeContext(customerCode);

    return subject.on('update', () => { })
      .then(end => end())
      .should.be.fulfilled;
  });

  it('throws if given an unsupported event', () => {
    const subject = new UserMessagesStatusRealTimeContext(customerCode);

    (() => subject.on('delete', () => { })).should.throw();
  });
});
