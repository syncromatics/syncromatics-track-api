import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import TagsContext from './TagsContext';
import { tags as mockTags } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When building a query for tags', () => {
  const client = new Client();
  client.setAuthenticated();

  beforeEach(() => fetchMock
    .get(client.resolve('/1/SYNC/tags?page=9&perPage=27&q=valid&sort='), mockTags.list)
    .catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const tags = new TagsContext(client, 'SYNC');
    promise = tags
      .withPage(9)
      .withPerPage(27)
      .withQuery('valid')
      .getPage();
  });

  it('should make the expected request', () => promise.should.be.fulfilled);
});
