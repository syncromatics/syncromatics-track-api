import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import AssignableRoute from './AssignableRoute';
import { assignableRoutes as mockAssignableRoutes } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating an assignable route based on customer and ID', () => {
  const client = new Client();
  const assignableRoute = new AssignableRoute(client, AssignableRoute.makeHref('SYNC', 'blue_line'));

  it('should set the href', () => assignableRoute.href.should.equal('/1/SYNC/assignable_entities/routes/blue_line'));
  it('should not be hydrated', () => assignableRoute.hydrated.should.equal(false));
});

describe('When instantiating an assignable route based on an object', () => {
  const client = new Client();
  const assignableRoute = new AssignableRoute(client, mockAssignableRoutes.getById('blue_line'));

  it('should set the ID', () => assignableRoute.id.should.equal('blue_line'));
  it('should set the href', () => assignableRoute.href.should.equal('/1/SYNC/assignable_entities/routes/blue_line'));
  it('should be hydrated', () => assignableRoute.hydrated.should.equal(true));
});

describe('When fetching an assignable route based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mockAssignableRoutes.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new AssignableRoute(client, AssignableRoute.makeHref('SYNC', 'blue_line')).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(v => v.id).should.eventually.equal('blue_line'));
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/assignable_entities/routes/blue_line'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});
