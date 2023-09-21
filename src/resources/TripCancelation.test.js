import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import TripCancelation from "./TripCancelation";
import { tripCancelations as mockTripCancelations } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a trip cancelation based on customer and ID', () => {
  const client = new Client();
  const tc = new TripCancelation(client, TripCancelation.makeHref('SYNC', 1));

  it('should set the href', () => tc.href.should.equal('/1/SYNC/serviceadjustments/cancelation/1'));
  it('should not be hydrated', () => tc.hydrated.should.equal(false));
});

// describe('When instantiating a trip cancelation based on an object', () => {
//   const client = new Client();
//   const tc = new TripCancelation(client, mockTripCancelations.getById(1));
//
//   it('should set the ID', () => tc.id.should.equal(1));
//   it('should set the href', () => tc.href.should.equal('/1/SYNC/serviceadjustments/cancelation/1'));
//   it('should be hydrated', () => tc.hydrated.should.equal(true));
// });

describe('When fetching a trip cancelation based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mockTripCancelations.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new TripCancelation(client, TripCancelation.makeHref('SYNC', 1)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(v => v.id).should.eventually.equal(1));
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/serviceadjustments/cancelation/1'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});

describe('When creating a trip cancelation', () => {
  const client = new Client();

  beforeEach(() => mockTripCancelations.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new TripCancelation(client, [{ tripId: 1, customerId: 1, uncancel: false, userId: 1 },{ tripId: 2, customerId: 1, uncancel: true, userId: 1 }]).create();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/serviceadjustments/cancelation/1'));
  it('should set the ID', () => promise.then(v => v.id).should.eventually.equal(1));
});