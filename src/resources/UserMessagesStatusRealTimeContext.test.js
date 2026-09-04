import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import UserMessagesStatusRealTimeContext from './UserMessagesStatusRealTimeContext';
import RealTimeClient from '../RealTimeClient';
import { realTime as mock, userMessagesStatus } from '../mocks';
import * as messages from '../subscriptions/messages';

chai.should();
chai.use(chaiAsPromised);

describe('When subscribing to User Messages Status', () => {
  const customerCode = 'SYNC';

  const createSubject = () => {
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    return {
      realTimeClient,
      subject: new UserMessagesStatusRealTimeContext(realTimeClient, customerCode),
    };
  };

  it('subscribes without filters', () => {
    const server = mock.getServer();
    const { realTimeClient, subject } = createSubject();
    subject.on('update', () => {});

    return server.verifySubscription('ROOM_MESSAGES_STATUS', {
      closeConnection: true,
      realTimeClient,
    }).should.eventually.deep.equal({});
  });

  it('passes the initial unread counts through unchanged', () => {
    const server = mock.getServer();
    const { realTimeClient, subject } = createSubject();
    let resolver;
    const updateReceived = new Promise((resolve) => { resolver = resolve; });
    subject.on('update', resolver);

    return updateReceived
      .then((response) => {
        response.data.should.deep.equal(userMessagesStatus.list);
        response.data.forEach(status => status.should.have.all.keys([
          'unread_count',
          'room_href',
        ]));
      })
      .then(() => server.closeConnection(realTimeClient));
  });

  it('passes incremental multi-room and zero-count updates through', () => {
    const server = mock.getServer();
    const { realTimeClient, subject } = createSubject();
    const incremental = [
      { unread_count: 0, room_href: '/1/SYNC/room_messages/397' },
      { unread_count: 1, room_href: '/1/SYNC/room_messages/403' },
    ];
    let updateCount = 0;
    let resolveIncremental;
    const incrementalReceived = new Promise((resolve) => { resolveIncremental = resolve; });

    subject.on('update', (response) => {
      updateCount += 1;
      if (updateCount === 1) {
        server.emit('message', JSON.stringify({
          type: messages.ENTITY.UPDATE,
          subscription_id: response.subscription_id,
          data: incremental,
        }));
      } else {
        resolveIncremental(response);
      }
    });

    return incrementalReceived
      .then(response => response.data.should.deep.equal(incremental))
      .then(() => server.closeConnection(realTimeClient));
  });
});
