import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import AreasContext from './AreasContext';
import { areas as mockAreas } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When building a query for areas', () => {
  const client = new Client();
  client.setAuthenticated();

  beforeEach(() => fetchMock
  .get(client.resolve('/1/SYNC/areas?page=9&per_page=27&sort='), mockAreas.list)
    .catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const areas = new AreasContext(client, 'SYNC');
    promise = areas
      .withPage(9)
      .withPerPage(27)
      .getPage();
  });

  it('should make the expected request', () => promise.should.be.fulfilled);
});
