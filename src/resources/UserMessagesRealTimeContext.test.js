import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import UserMessagesRealTimeContext from './UserMessagesRealTimeContext';

chai.should();
chai.use(chaiAsPromised);

describe('When subscribing to User Messages', () => {
  const customerCode = 'SYNC';

  it('receives an inbox of 6 rooms with 1-2 messages each when no room is named', () => {
    const subject = new UserMessagesRealTimeContext(customerCode);

    let resolver;
    const updateReceived = new Promise((resolve) => { resolver = resolve; });

    const subscription = subject.on('update', resolver);

    return Promise.all([
      subscription,
      updateReceived.then((message) => {
        const rooms = message.data.reduce((byRoom, chatMessage) => ({
          ...byRoom,
          [chatMessage.roomHref]: (byRoom[chatMessage.roomHref] || 0) + 1,
        }), {});

        Object.keys(rooms).should.have.lengthOf(6);
        Object.keys(rooms).forEach((roomHref) => {
          rooms[roomHref].should.be.within(1, 2);
        });

        message.data.forEach((chatMessage) => {
          chatMessage.href.should.equal(`${chatMessage.roomHref.replace(/\/$/, '')}/messages/${chatMessage.id}`);
        });
      }),
    ]);
  });

  it('does not keep delivering messages when no room is named', () => {
    const subject = new UserMessagesRealTimeContext(customerCode);
    subject.millisecondsBetweenMessages = 10;

    const receivedMessages = [];

    return subject
      .on('update', (message) => {
        receivedMessages.push(...message.data);
      })
      .then(() => {
        const countAfterInbox = receivedMessages.length;
        return new Promise((resolve) => {
          setTimeout(() => {
            receivedMessages.should.have.lengthOf(countAfterInbox);
            resolve();
          }, 50);
        });
      });
  });

  it('immediately receives the first 3 messages of a mocked conversation for the room', () => {
    const subject = new UserMessagesRealTimeContext(customerCode);

    let resolver;
    const updateReceived = new Promise((resolve) => { resolver = resolve; });

    const subscription = subject.forRoom('dispatch/messages/abc-123').on('update', resolver);

    return Promise.all([
      subscription,
      updateReceived.then((message) => {
        message.data.should.have.lengthOf(3);
        message.data.forEach((chatMessage) => {
          chatMessage.roomHref.should.equal('dispatch/messages/abc-123');
          chatMessage.href.should.equal(`dispatch/messages/abc-123/messages/${chatMessage.id}`);
          chatMessage.should.have.all.keys([
            'id', 'customerId', 'authorFirstName', 'authorLastName', 'authorHref', 'roomHref',
            'message', 'seenTime', 'sentTime', 'platformType', 'href',
          ]);
        });
      }),
    ]);
  });

  it('receives one new message at a time as the conversation continues', () => {
    const subject = new UserMessagesRealTimeContext(customerCode);
    subject.millisecondsBetweenMessages = 10;

    const receivedMessages = [];
    let resolveFourth;
    const fourthMessageReceived = new Promise((resolve) => { resolveFourth = resolve; });

    const subscription = subject
      .forRoom('dispatch/messages/abc-123')
      .on('update', (message) => {
        receivedMessages.push(...message.data);
        if (receivedMessages.length === 4) {
          resolveFourth();
        }
      });

    return Promise.all([
      subscription,
      fourthMessageReceived.then(() => {
        receivedMessages.should.have.lengthOf(4);
        receivedMessages[3].id.should.equal(4);
      }),
    ]);
  });

  it('can unsubscribe from the conversation', () => {
    const subject = new UserMessagesRealTimeContext(customerCode);
    subject.millisecondsBetweenMessages = 10;

    const receivedMessages = [];

    return subject
      .forRoom('dispatch/messages/abc-123')
      .on('update', (message) => {
        receivedMessages.push(...message.data);
      })
      .then((end) => end())
      .then(() => {
        const countAfterUnsubscribe = receivedMessages.length;
        return new Promise((resolve) => {
          setTimeout(() => {
            receivedMessages.should.have.lengthOf(countAfterUnsubscribe);
            resolve();
          }, 50);
        });
      });
  });

  it('throws if given an unsupported event', () => {
    const subject = new UserMessagesRealTimeContext(customerCode).forRoom('abc-123');
    (() => subject.on('delete', () => {})).should.throw();
  });

  it('delivers a sent message to the active subscriber', () => {
    const subject = new UserMessagesRealTimeContext(customerCode);
    subject.millisecondsBetweenMessages = 100000; // keep the scripted conversation from interfering

    const receivedMessages = [];

    return subject
      .forRoom('dispatch/messages/abc-123')
      .on('update', (message) => {
        receivedMessages.push(...message.data);
      })
      .then(() => subject.send('Hello from the demo'))
      .then((sentMessage) => {
        sentMessage.message.should.equal('Hello from the demo');
        sentMessage.roomHref.should.equal('dispatch/messages/abc-123');
        sentMessage.href.should.equal(`dispatch/messages/abc-123/messages/${sentMessage.id}`);
        sentMessage.platformType.should.equal(1);
        receivedMessages[receivedMessages.length - 1].should.deep.equal(sentMessage);
      });
  });

  it('rejects sending a message before subscribing', () => {
    const subject = new UserMessagesRealTimeContext(customerCode).forRoom('abc-123');
    return subject.send('too soon').should.be.rejected;
  });

  it('resolves marking messages as read without doing anything', () => {
    const subject = new UserMessagesRealTimeContext(customerCode).forRoom('abc-123');
    return subject.markMessagesRead([1, 2, 3]).should.be.fulfilled;
  });
});
