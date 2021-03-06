import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import ExternalApisContext from './ExternalApisContext';
import { externalApis as mockExternalApis } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When building a query for external APIs', () => {
  const client = new Client();
  client.setAuthenticated();

  beforeEach(() => fetchMock
    .get(client.resolve('/1/external_apis?page=9&per_page=27&q=valid&sort=first_valid asc,second_valid desc'), mockExternalApis.list)
    .catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const externalApis = new ExternalApisContext(client);
    promise = externalApis
      .withPage(9)
      .withPerPage(27)
      .withQuery('valid')
      .sortedBy('ignored', 'desc')
      .sortedBy('first_valid')
      .thenBy('second_valid', 'desc')
      .getPage();
  });

  it('should make the expected request', () => promise.should.be.fulfilled);
});
