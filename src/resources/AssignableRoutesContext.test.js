import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import AssignableRoutesContext from './AssignableRoutesContext';
import { assignableRoutes as mockAssignableRoutes } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When building a query for assignable routes', () => {
  const client = new Client();
  client.setAuthenticated();

  beforeEach(() => fetchMock
    .get(client.resolve('/1/SYNC/assignable_entities/routes?page=1&per_page=10&sort='), mockAssignableRoutes.list)
    .catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const routes = new AssignableRoutesContext(client, 'SYNC');
    promise = routes
      .withPage(1)
      .withPerPage(10)
      .getPage();
  });

  it('should make the expected request', () => promise.should.be.fulfilled);
});
