import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import Service from './Service';
import { services as mockServices } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a service based on customer and ID', () => {
  const client = new Client();
  const service = new Service(client, Service.makeHref('SYNC', 1));

  it('should set the href', () => service.href.should.equal('/1/SYNC/services/1'));
  it('should not be hydrated', () => service.hydrated.should.equal(false));
});

describe('When instantiating a service based on an object', () => {
  const client = new Client();
  const service = new Service(client, mockServices.getById(1));

  it('should set the ID', () => service.id.should.equal(1));
  it('should set the href', () => service.href.should.equal('/1/SYNC/services/1'));
  it('should be hydrated', () => service.hydrated.should.equal(true));
  it('should set the start', () => service.start.should.equal('2017-01-01T00:00:00.000-0700'));
  it('should set the end', () => service.end.should.equal('2017-04-01T00:00:00.000-0700'));
  it('should set the service days', () => service.days_of_week.should.equal('Sunday, Saturday'));
  it('should map every run', () => service.runs.length.should.equal(2));
  it('should hydrate every run', () => service.runs.every(r => r.hydrated.should.equal(true)));
  it('should map every trip', () => service.trips.length.should.equal(2));
  it('should hydrate every trip', () => service.trips.every(t => t.hydrated.should.equal(true)));
});

describe('When fetching a service based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mockServices.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Service(client, Service.makeHref('SYNC', 1)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(p => p.id).should.eventually.equal(1));
  it('should set the href', () => promise.then(p => p.href).should.eventually.equal('/1/SYNC/services/1'));
  it('should be hydrated', () => promise.then(p => p.hydrated).should.eventually.equal(true));
  it('should set the start', () => promise.then(p => p.start).should.eventually.equal('2017-01-01T00:00:00.000-0700'));
  it('should set the end', () => promise.then(p => p.end).should.eventually.equal('2017-04-01T00:00:00.000-0700'));
  it('should set the service days', () => promise.then(p => p.days_of_week).should.eventually.equal('Sunday, Saturday'));
  it('should map every run', () => promise.then(p => p.runs.length).should.eventually.equal(2));
  it('should hydrate every run', () => promise.then(p => p.runs.every(r => r.hydrated.should.equal(true))));
  it('should map every trip', () => promise.then(p => p.trips.length).should.eventually.equal(2));
  it('should hydrate every trip', () => promise.then(p => p.trips.every(t => t.hydrated.should.equal(true))));
});
