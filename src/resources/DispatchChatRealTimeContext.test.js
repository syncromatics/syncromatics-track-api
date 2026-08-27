import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import DispatchChatRealTimeContext from './DispatchChatRealTimeContext';
import RealTimeClient from '../RealTimeClient';
import { realTime as mock, dispatchChatMessages } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When creating a subscription for Dispatch Chat', () => {
  const entity = 'DISPATCH_CHAT';
  const customerCode = 'SYNC';
  const emptyFilters = {
    rooms: [],
  };

  it('can add filters for a single room', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new DispatchChatRealTimeContext(realTimeClient, customerCode);

    const roomHref = 'dispatch/messages/abc-123';
    const expectedFilters = {
      ...emptyFilters,
      rooms: [roomHref],
    };
    subject.forRoom(roomHref).on('update', () => {});

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('can add filters for an array of rooms', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new DispatchChatRealTimeContext(realTimeClient, customerCode);

    const roomHrefs = ['dispatch/messages/abc-123', 'dispatch/messages/def-456'];
    const expectedFilters = {
      ...emptyFilters,
      rooms: roomHrefs,
    };
    subject.forRooms(roomHrefs).on('update', () => {});

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('immediately receives the first 3 messages of the mocked conversation', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new DispatchChatRealTimeContext(realTimeClient, customerCode);

    let resolver;
    const updateReceived = new Promise((resolve) => { resolver = resolve; });

    const subscription = subject
      .forRoom('dispatch/messages/abc-123')
      .on('update', resolver);

    return Promise.all([
      subscription,
      updateReceived.then((message) => {
        message.data.should.deep.equal(dispatchChatMessages.list.slice(0, 3));
        return server.closeConnection(realTimeClient);
      }),
    ]);
  });

  it('receives one new message at a time as the conversation continues', function test() {
    this.timeout(5000);
    const originalIntervalMs = dispatchChatMessages.intervalMs;
    dispatchChatMessages.intervalMs = 10;

    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new DispatchChatRealTimeContext(realTimeClient, customerCode);

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
        receivedMessages.should.deep.equal(dispatchChatMessages.list.slice(0, 4));
        dispatchChatMessages.intervalMs = originalIntervalMs;
        return server.closeConnection(realTimeClient);
      }),
    ]);
  });

  it('can unsubscribe from the conversation', () => {
    const originalIntervalMs = dispatchChatMessages.intervalMs;
    dispatchChatMessages.intervalMs = 10;

    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new DispatchChatRealTimeContext(realTimeClient, customerCode);

    const subscription = subject
      .forRoom('dispatch/messages/abc-123')
      .on('update', () => {});

    const subscriptionEnd = subscription.then(end => end());

    const connectionClosed = subscriptionEnd.then(() => {
      dispatchChatMessages.intervalMs = originalIntervalMs;
      return server.closeConnection(realTimeClient);
    });

    return Promise.all([
      subscription,
      subscriptionEnd,
      connectionClosed,
    ]);
  });
});
