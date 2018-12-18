import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import MessagesContext from './MessagesContext';
import { messages as mockMessages } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When building a query for messages', () => {
  const client = new Client();
  client.setAuthenticated();

  beforeEach(() => fetchMock
    .get(client.resolve('/1/SYNC/messages?page=9&per_page=27&q=valid&sort='), mockMessages.list)
    .catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const messages = new MessagesContext(client, 'SYNC');
    promise = messages
      .withPage(9)
      .withPerPage(27)
      .withQuery('valid')
      .getPage();
  });

  it('should make the expected request', () => promise.should.be.fulfilled);
});
