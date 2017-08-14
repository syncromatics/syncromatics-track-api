import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import PatternsContext from './PatternsContext';
import { patterns as mockPatterns } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When building a query for patterns', () => {
  const client = new Client();
  client.setAuthenticated();

  beforeEach(() => fetchMock
    .get(client.resolve('/1/SYNC/patterns?page=9&perPage=27&q=valid&expand=stops&sort=first_valid asc,second_valid desc'), mockPatterns.list)
    .catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const patterns = new PatternsContext(client, 'SYNC');
    promise = patterns
      .withPage(9)
      .withPerPage(27)
      .withQuery('valid')
      .withExpandedProperty('stops')
      .sortedBy('ignored', 'desc')
      .sortedBy('first_valid')
      .thenBy('second_valid', 'desc')
      .getPage();
  });

  it('should make the expected request', () => promise.should.be.fulfilled);
});
