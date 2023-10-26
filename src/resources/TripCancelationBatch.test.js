import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import TripCancelationBatch from './TripCancelationBatch';
import { tripCancelationBatches as mocks } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating trip cancelations based on customer', () => {
  const client = new Client();
  const batch = new TripCancelationBatch(client, TripCancelationBatch.makeHref('SYNC'));
  it('should set the href', () => batch.href.should.equal('/1/SYNC/serviceadjustments/cancelations'));
  it('should not be hydrated', () => batch.hydrated.should.equal(false));
});

describe('When fetching trip cancelations based on customer', () => {
  const client = new Client();

  beforeEach(() => mocks.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new TripCancelationBatch(client, TripCancelationBatch.makeHref('SYNC')).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the href', () => promise.then(x => x.href).should.eventually.equal('/1/SYNC/serviceadjustments/cancelations'));
  it('should set the trip cancelations', () => promise.then(x => x.length).should.eventually.equal(2));
  it('should be hydrated', () => promise.then(x => x.hydrated).should.eventually.equal(true));
});

describe('When creating trip cancelations for a customer', () => {
  const client = new Client();

  beforeEach(() => mocks.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new TripCancelationBatch(client, { code: 'SYNC',
      ...
        [
          { href: '/1/SYNC/serviceadjustments/cancelations/1' },
          { href: '/1/SYNC/serviceadjustments/cancelations/2' },
        ],
    }).create();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the message', () => promise.then(x => x.length).should.eventually.equal(2));
  it('should be hydrated', () => promise.then(x => x.hydrated).should.eventually.equal(true));
});
