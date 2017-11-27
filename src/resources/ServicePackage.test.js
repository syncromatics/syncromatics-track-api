import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import ServicePackage from './ServicePackage';
import { servicePackages as mockServicePackages } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a service package based on customer and ID', () => {
  const client = new Client();
  const servicePackage = new ServicePackage(client, ServicePackage.makeHref('SYNC', 1));

  it('should set the href', () => servicePackage.href.should.equal('/1/SYNC/service_packages/1'));
  it('should not be hydrated', () => servicePackage.hydrated.should.equal(false));
});

describe('When instantiating a service package based on an object', () => {
  const client = new Client();
  const servicePackage = new ServicePackage(client, mockServicePackages.getById(1));

  it('should set the ID', () => servicePackage.id.should.equal(1));
  it('should set the href', () => servicePackage.href.should.equal('/1/SYNC/service_packages/1'));
  it('should be hydrated', () => servicePackage.hydrated.should.equal(true));
  it('should have three services', () => servicePackage.services.length.should.equal(3));
  it('should have the expected services', () => servicePackage.services.should.deep.equal([
    { href: '/1/SYNC/services/1' },
    { href: '/1/SYNC/services/2' },
    { href: '/1/SYNC/services/3' },
  ]));
});

describe('When fetching a service package based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mockServicePackages.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new ServicePackage(client, ServicePackage.makeHref('SYNC', 1)).fetch();
  });

  it('should set the ID', () => promise.then(p => p.id).should.eventually.equal(1));
  it('should set the href', () => promise.then(p => p.href).should.eventually.equal('/1/SYNC/service_packages/1'));
  it('should be hydrated', () => promise.then(p => p.hydrated).should.eventually.equal(true));
  it('should have three services', () => promise.then(p => p.services.length).should.eventually.equal(3));
  it('should have the expected services', () => promise.then(p => p.services).should.eventually.deep.equal([
    { href: '/1/SYNC/services/1' },
    { href: '/1/SYNC/services/2' },
    { href: '/1/SYNC/services/3' },
  ]));
});
