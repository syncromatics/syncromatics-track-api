import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import Stop from './Stop';
import { stops as mockStops } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a stop based on customer and ID', () => {
  const client = new Client();
  const stop = new Stop(client, Stop.makeHref('SYNC', 1));

  it('should set the href', () => stop.href.should.equal('/1/SYNC/stops/1'));
  it('should not be hydrated', () => stop.hydrated.should.equal(false));
});

describe('When instantiating a stop based on an object', () => {
  const client = new Client();
  const stop = new Stop(client, mockStops.getById(1));

  it('should set the ID', () => stop.id.should.equal(1));
  it('should set the href', () => stop.href.should.equal('/1/SYNC/stops/1'));
  it('should be hydrated', () => stop.hydrated.should.equal(true));
});

describe('When fetching a stop based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mockStops.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Stop(client, Stop.makeHref('SYNC', 1)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(v => v.id).should.eventually.equal(1));
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/stops/1'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});

describe('When creating a stop', () => {
  const client = new Client();

  beforeEach(() => mockStops.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Stop(client, { code: 'SYNC', name: '1st and Main' }).create();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/stops/1'));
  it('should set the ID', () => promise.then(v => v.id).should.eventually.equal(1));
});

describe('When updating a stop', () => {
  const client = new Client();
  const updateValue = 'First and Main';

  beforeEach(() => mockStops.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Stop(client, { code: 'SYNC', name: '1st and Main' })
      .create()
      .then((stop) => {
        // eslint-disable-next-line no-param-reassign
        stop.name = updateValue;
        return stop.update();
      })
      .then(stop => stop);
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/stops/1'));
  it('should set the name', () => promise.then(v => v.name).should.eventually.equal(updateValue));
});
