import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import DispatchMessagesContext from './DispatchMessagesContext';
import { dispatchMessages as mocks } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When building a query for dispatch messages', () => {
  const client = new Client();
  client.setAuthenticated();

  beforeEach(() => fetchMock
    .get(client.resolve('/1/SYNC/dispatch_messages?page=1&per_page=10&q=chatter&sort='), mocks.list)
    .catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const dispatchMessages = new DispatchMessagesContext(client, 'SYNC');
    promise = dispatchMessages
      .withPage(1)
      .withPerPage('10')
      .withQuery('chatter')
      .getPage();
  });

  it('should make the expected request', () => promise.should.be.fulfilled);
});
