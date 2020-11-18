import chai from 'chai';
import fetchMock from 'fetch-mock';
import chaiAsPromised from 'chai-as-promised';
import Client from '../Client';
import DispatchMessageStatus from './DispatchMessageStatus';
import { dispatchMessageStatus as mockDispatchMessageStatus } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When mark an dispatch message as read', () => {
  const client = new Client();
  beforeEach(() => mockDispatchMessageStatus.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);
  let promise;
  beforeEach(() => {
    promise = new DispatchMessageStatus(client, DispatchMessageStatus.makeHref('SYNC'))
      .markMessagesRead([
        '/1/SYNC/dispatch_message_statuses/111',
        '/1/SYNC/dispatch_message_statuses/222']);
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
});

