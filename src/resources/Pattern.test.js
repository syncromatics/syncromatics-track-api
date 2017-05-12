import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import Pattern from './Pattern';
import { patterns as mockPatterns } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a pattern based on customer and ID', () => {
  const client = new Client();
  const pattern = new Pattern(client, Pattern.makeHref('SYNC', 1));

  it('should set the href', () => pattern.href.should.equal('/1/SYNC/patterns/1'));
  it('should not be hydrated', () => pattern.hydrated.should.equal(false));
});

describe('When instantiating a pattern based on an object', () => {
  const client = new Client();
  const pattern = new Pattern(client, mockPatterns.getById(1));

  it('should set the ID', () => pattern.id.should.equal(1));
  it('should set the href', () => pattern.href.should.equal('/1/SYNC/patterns/1'));
  it('should be hydrated', () => pattern.hydrated.should.equal(true));
  it('should have six stops', () => pattern.stops.length.should.equal(6));
  it('should have the expected route', () => pattern.route.href.should.equal('/1/SYNC/routes/1'));
});

describe('When fetching a pattern based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mockPatterns.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Pattern(client, Pattern.makeHref('SYNC', 1)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(p => p.id).should.eventually.equal(1));
  it('should set the href', () => promise.then(p => p.href).should.eventually.equal('/1/SYNC/patterns/1'));
  it('should be hydrated', () => promise.then(p => p.hydrated).should.eventually.equal(true));
  it('should have six stops', () => promise.then(p => p.stops.length).should.eventually.equal(6));
  it('should have the expected route', () => promise.then(p => p.route.href).should.eventually.equal('/1/SYNC/routes/1'));
});
