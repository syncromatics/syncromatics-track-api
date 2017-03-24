import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import RoutesContext from './RoutesContext';
import { routes as mockRoutes } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When building a query for routes', () => {
  const client = new Client();
  client.setAuthenticated();

  beforeEach(() => fetchMock
    .get(client.resolve('/1/SYNC/routes?page=9&perPage=27&q=valid&sort=first_valid asc,second_valid desc'), mockRoutes.list)
    .catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const routes = new RoutesContext(client, 'SYNC');
    promise = routes
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
