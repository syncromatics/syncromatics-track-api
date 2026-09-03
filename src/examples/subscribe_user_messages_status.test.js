import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, realTime as realTimeMocks } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When subscribing to user messages status', () => {
  let server;
  const api = new Track({
    autoRenew: false,
    reconnectOnClose: false,
    ...realTimeMocks.options,
  });

  before(() => { server = realTimeMocks.getServer(); });
  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));

  afterEach(fetchMock.restore);
  after(() => server.close());

  it('should get unread counts per room for the authenticated user', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });
    return api.customer('SYNC')
      .realTime()
      .userMessagesStatus()
      // do things with the unread counts, e.g. { room_href, unread_count }
      .on('update', response => response.data);
  });

  it('should match unread counts to the rooms messages arrive for', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });
    const realTime = api.customer('SYNC').realTime();

    const unreadByRoom = {};

    return realTime
      .userMessagesStatus()
      .on('update', ({ data }) => data.forEach(({ room_href: roomHref, unread_count: count }) => {
        unreadByRoom[roomHref] = count;
      }))
      // subscribing without a room gives you every room's latest messages, whose roomHref is the
      // same href the unread counts are keyed by
      .then(() => realTime.userMessages().on('update', ({ data }) => data.map(message => ({
        ...message,
        unreadCount: unreadByRoom[message.roomHref] || 0,
      }))));
  });
});
