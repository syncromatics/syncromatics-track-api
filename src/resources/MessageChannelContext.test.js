import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import MessageChannelContext from './MessageChannelContext';
import { messageChannels as mockMessageChannels } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When building a query for messageChannels', () => {
  const client = new Client();
  client.setAuthenticated();

  beforeEach(() => fetchMock
    .get(client.resolve('/1/SYNC/message_channels'), mockMessageChannels.list)
    .catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const messageChannels = new MessageChannelContext(client, 'SYNC');
    promise = messageChannels.getPage();
  });

  it('should make the expected request', () => promise.should.be.fulfilled);
});
