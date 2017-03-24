import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import SignsContext from './SignsContext';
import { signs as mockSigns } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When building a query for signs', () => {
  const client = new Client();
  client.setAuthenticated();

  beforeEach(() => fetchMock
    .get(client.resolve('/1/SYNC/signs?page=9&perPage=27&q=valid&sort='), mockSigns.list)
    .catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const signs = new SignsContext(client, 'SYNC');
    promise = signs
      .withPage(9)
      .withPerPage(27)
      .withQuery('valid')
      .getPage();
  });

  it('should make the expected request', () => promise.should.be.fulfilled);
});
