import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import Run from './Run';
import { runs as mockRuns } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a run based on customer and ID', () => {
  const client = new Client();
  const run = new Run(client, Run.makeHref('SYNC', 1));

  it('should set the href', () => run.href.should.equal('/1/SYNC/runs/1'));
  it('should not be hydrated', () => run.hydrated.should.equal(false));
});

describe('When instantiating a run based on an object', () => {
  const client = new Client();
  const run = new Run(client, mockRuns.getById(1));

  it('should set the ID', () => run.id.should.equal(1));
  it('should set the href', () => run.href.should.equal('/1/SYNC/runs/1'));
  it('should be hydrated', () => run.hydrated.should.equal(true));
  it('should set the name', () => run.name.should.equal('Run 1'));
  it('should set the short name', () => run.short_name.should.equal('R01'));
  it('should map every trip', () => run.trips.length.should.equal(2));
});

describe('When fetching a trip based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mockRuns.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Run(client, Run.makeHref('SYNC', 1)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(p => p.id).should.eventually.equal(1));
  it('should set the href', () => promise.then(p => p.href).should.eventually.equal('/1/SYNC/runs/1'));
  it('should be hydrated', () => promise.then(p => p.hydrated).should.eventually.equal(true));
  it('should set the name', () => promise.then(p => p.name).should.eventually.equal('Run 1'));
  it('should set the short name', () => promise.then(p => p.short_name).should.eventually.equal('R01'));
  it('should map every trip', () => promise.then(p => p.trips.length).should.eventually.equal(2));
});
