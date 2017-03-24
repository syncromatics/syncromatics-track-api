import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import Route from './Route';
import { routes as mockRoutes } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a route based on customer and ID', () => {
  const client = new Client();
  const route = new Route(client, Route.makeHref('SYNC', 1));

  it('should set the href', () => route.href.should.equal('/1/SYNC/routes/1'));
  it('should not be hydrated', () => route.hydrated.should.equal(false));
});

describe('When instantiating a route based on an object', () => {
  const client = new Client();
  const route = new Route(client, mockRoutes.getById(1));

  it('should set the ID', () => route.id.should.equal(1));
  it('should set the href', () => route.href.should.equal('/1/SYNC/routes/1'));
  it('should be hydrated', () => route.hydrated.should.equal(true));
  it('should have one pattern', () => route.patterns.length.should.equal(1));
  it('should have the expected pattern', () => route.patterns[0].href.should.equal('/1/SYNC/patterns/1'));
});

describe('When fetching a route based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mockRoutes.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Route(client, Route.makeHref('SYNC', 1)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(r => r.id).should.eventually.equal(1));
  it('should set the href', () => promise.then(r => r.href).should.eventually.equal('/1/SYNC/routes/1'));
  it('should be hydrated', () => promise.then(r => r.hydrated).should.eventually.equal(true));
  it('should have one pattern', () => promise.then(r => r.patterns.length).should.eventually.equal(1));
  it('should have the expected pattern', () => promise.then(r => r.patterns[0].href).should.eventually.equal('/1/SYNC/patterns/1'));
});
