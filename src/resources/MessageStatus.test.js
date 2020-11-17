import chai from 'chai';
import fetchMock from 'fetch-mock';
import chaiAsPromised from 'chai-as-promised';
import Client from '../Client';
import MessageStatus from './MessageStatus';
import { messageStatus as mockMessageStatus } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When mark an incident as read', () => {
  const client = new Client();
  beforeEach(() => mockMessageStatus.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);
  let promise;
  beforeEach(() => {
    promise = new MessageStatus(client, MessageStatus.makeHref('SYNC'))
      .markMessagesRead([
        '/1/SYNC/dispatch_message_statuses/111',
        '/1/SYNC/dispatch_message_statuses/222']);
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
});

