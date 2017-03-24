import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import MessageTemplatesContext from './MessageTemplatesContext';
import { messageTemplates as mockMessageTemplates } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When building a query for message templates', () => {
  const client = new Client();
  client.setAuthenticated();

  beforeEach(() => fetchMock
    .get(client.resolve('/1/SYNC/message_templates?page=9&perPage=27&q=valid&sort='), mockMessageTemplates.list)
    .catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const messageTemplates = new MessageTemplatesContext(client, 'SYNC');
    promise = messageTemplates
      .withPage(9)
      .withPerPage(27)
      .withQuery('valid')
      .getPage();
  });

  it('should make the expected request', () => promise.should.be.fulfilled);
});
