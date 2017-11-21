import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import DriversContext from './DriversContext';
import { drivers as mockDrivers } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When building a query for drivers', () => {
  const client = new Client();
  client.setAuthenticated();

  beforeEach(() => fetchMock
  .get(client.resolve('/1/SYNC/drivers?page=9&per_page=27&q=charlie&sort=first_name asc,last_name desc'), mockDrivers.list)
    .catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const drivers = new DriversContext(client, 'SYNC');
    promise = drivers
      .withPage(9)
      .withPerPage(27)
      .withQuery('charlie')
      .sortedBy('ignored', 'desc')
      .sortedBy('first_name')
      .thenBy('last_name', 'desc')
      .getPage();
  });

  it('should make the expected request', () => promise.should.be.fulfilled);
});
