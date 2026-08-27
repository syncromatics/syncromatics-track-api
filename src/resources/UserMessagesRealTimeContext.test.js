import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import UserMessagesRealTimeContext from './UserMessagesRealTimeContext';

chai.should();
chai.use(chaiAsPromised);

describe('When subscribing to User Messages', () => {
  const customerCode = 'SYNC';

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
          chatMessage.roomId.should.equal('dispatch/messages/abc-123');
          chatMessage.should.have.all.keys([
            'id', 'customerId', 'authorFirstName', 'authorLastName', 'authorId', 'roomId',
            'message', 'seenTime', 'sentTime', 'platformType', 'authorHref',
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
});
