import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import TripCancelation from "./TripCancelation";
import tripCancelationBatches from "../mocks/tripCancelationBatches";

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a TripCancelation based on customer and ID', () => {
  const client = new Client();
  const tripCancelation = new TripCancelation(client, TripCancelation.makeHref('SYNC', 1));

  it('should set the href', () => tripCancelation.href.should.equal('/1/SYNC/serviceadjustments/tripcancelation/1'));
  it('should not be hydrated', () => tripCancelation.hydrated.should.equal(false));
});

describe('When instantiating a TripCancelation based on an object', () => {
  const client = new Client();
  const tripCancelation = new TripCancelation(client, tripCancelationBatches.getById(1));

  it('should set the ID', () => tripCancelation.id.should.equal(1));
  it('should set the href', () => tripCancelation.href.should.equal('/1/SYNC/serviceadjustments/tripcancelation/1'));
  it('should be hydrated', () => tripCancelation.hydrated.should.equal(true));
});

describe('When fetching a TripCancelation based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => tripCancelationBatches.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new TripCancelation(client, TripCancelation.makeHref('SYNC', 1)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(v => v.id).should.eventually.equal(1));
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/serviceadjustments/tripcancelation/1'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});
