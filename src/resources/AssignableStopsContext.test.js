import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import AssignableStopsContext from './AssignableStopsContext';
import { assignableStops as mockAssignableStops } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When building a query for assignable stops', () => {
  const client = new Client();
  client.setAuthenticated();

  beforeEach(() => fetchMock
    .get(client.resolve('/1/SYNC/assignable_entities/stops?page=1&per_page=10&sort='), mockAssignableStops.list)
    .catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const stops = new AssignableStopsContext(client, 'SYNC');
    promise = stops
      .withPage(1)
      .withPerPage(10)
      .getPage();
  });

  it('should make the expected request', () => promise.should.be.fulfilled);
});
