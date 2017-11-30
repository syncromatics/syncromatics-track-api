import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import ServicePackagesContext from './ServicePackagesContext';
import { servicePackages as mockServicePackages } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When building a query for service packages', () => {
  const client = new Client();
  client.setAuthenticated();


  beforeEach(() => fetchMock
    .get(client.resolve('/1/SYNC/service_packages?page=9&per_page=27&q=valid&as_of=2017-01-01&sort=first_valid asc,second_valid desc'), mockServicePackages.list)
    .catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const servicePackages = new ServicePackagesContext(client, 'SYNC');
    promise = servicePackages
      .withPage(9)
      .withPerPage(27)
      .withQuery('valid')
      .sortedBy('ignored', 'desc')
      .sortedBy('first_valid')
      .thenBy('second_valid', 'desc')
      .asOf(new Date('2017-01-01T12:34:56'))
      .getPage();
  });

  it('should make the expected request', () => promise.should.be.fulfilled);
});
