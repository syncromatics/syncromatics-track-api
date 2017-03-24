import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import StopsContext from './StopsContext';
import { stops as mockStops } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When building a query for stops', () => {
  const client = new Client();
  client.setAuthenticated();

  beforeEach(() => fetchMock
    .get(client.resolve('/1/SYNC/stops?page=9&perPage=27&q=valid&sort='), mockStops.list)
    .catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const stops = new StopsContext(client, 'SYNC');
    promise = stops
      .withPage(9)
      .withPerPage(27)
      .withQuery('valid')
      .getPage();
  });

  it('should make the expected request', () => promise.should.be.fulfilled);
});
