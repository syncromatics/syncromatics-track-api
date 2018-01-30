import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import Trip from './Trip';
import { trips as mockTrips } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a trip based on customer and ID', () => {
  const client = new Client();
  const trip = new Trip(client, Trip.makeHref('SYNC', 1));

  it('should set the href', () => trip.href.should.equal('/1/SYNC/trips/1'));
  it('should not be hydrated', () => trip.hydrated.should.equal(false));
});

describe('When instantiating a trip based on an object', () => {
  const client = new Client();
  const trip = new Trip(client, mockTrips.getById(3));

  it('should set the ID', () => trip.id.should.equal(3));
  it('should set the href', () => trip.href.should.equal('/1/SYNC/trips/3'));
  it('should be hydrated', () => trip.hydrated.should.equal(true));
  it('should set the name', () => trip.name.should.equal('T03'));
  it('should set the short name', () => trip.short_name.should.equal('T3'));
  it('should set the order', () => trip.order.should.equal(1));
  it('should have the expected pattern', () => trip.pattern.href.should.equal('/1/SYNC/patterns/1'));
});

describe('When fetching a trip based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mockTrips.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Trip(client, Trip.makeHref('SYNC', 3)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(p => p.id).should.eventually.equal(3));
  it('should set the href', () => promise.then(p => p.href).should.eventually.equal('/1/SYNC/trips/3'));
  it('should be hydrated', () => promise.then(p => p.hydrated).should.eventually.equal(true));
  it('should set the name', () => promise.then(p => p.name).should.eventually.equal('T03'));
  it('should set the short name', () => promise.then(p => p.short_name).should.eventually.equal('T3'));
  it('should set the order', () => promise.then(p => p.order).should.eventually.equal(1));
  it('should have the expected pattern', () => promise.then(p => p.pattern.href).should.eventually.equal('/1/SYNC/patterns/1'));
});
