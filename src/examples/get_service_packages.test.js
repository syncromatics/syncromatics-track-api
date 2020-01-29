import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, servicePackages as mockServicePackages } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When searching for service packages by name', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockServicePackages.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a list of service packages', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const servicePackagesPromise = api.customer('SYNC').servicePackages()
      .withQuery('first') // Service packages containing "first" in their name
      .getPage()
      .then(page => page.list)
      .then(servicePackages => servicePackages); // Do things with list of service packages

    return servicePackagesPromise;
  });
});

describe('When retrieving a service package by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockServicePackages.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a service package', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const servicePackagePromise = api.customer('SYNC').servicePackage(1)
      .fetch()
      .then(servicePackage => servicePackage); // Do things with service package

    return servicePackagePromise;
  });
});
