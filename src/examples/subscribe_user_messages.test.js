import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import {
  charlie,
  realTime as realTimeMocks,
  userMessages,
} from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When using user messages', () => {
  let server;
  const api = new Track({
    autoRenew: false,
    reconnectOnClose: false,
    ...realTimeMocks.options,
  });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('subscribes to messages for a room', () => {
    server = realTimeMocks.getServer();
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    return api.customer('SYNC')
      .realTime()
      .userMessages({ platformType: 2 })
      .forRoom('/1/SYNC/room_messages/397')
      .on('update', ({ data }) => data)
      .then(end => end())
      .then(() => server.close());
  });

  it('creates a message and marks messages read', () => {
    const message = "Chris to cooper's room";
    userMessages.setUpSuccessfulMock(api.client, { message });
    const context = api.customer('SYNC')
      .realTime()
      .userMessages({ platformType: 2 })
      .forRoom('/1/SYNC/room_messages/397');

    return context.send(message)
      .then(created => context.markMessagesRead([created.id]));
  });
});
