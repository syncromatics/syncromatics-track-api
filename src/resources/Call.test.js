import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import Call from './Call';
import { calls as mockCalls } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a call based on customer and ID', () => {
  const client = new Client();
  const call = new Call(client, Call.makeHref('SYNC', 3));

  it('should set the href', () => call.href.should.equal('/1/SYNC/calls/3'));
  it('should not be hydrated', () => call.hydrated.should.equal(false));
});

describe('When instantiating a call based on an object', () => {
  const client = new Client();
  const call = new Call(client, mockCalls.getById(3));

  it('should set the ID', () => call.id.should.equal(3));
  it('should set the href', () => call.href.should.equal('/1/SYNC/calls/3'));
  it('should be hydrated', () => call.hydrated.should.equal(true));
});

describe('When fetching a call based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mockCalls.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Call(client, Call.makeHref('SYNC', 3)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(v => v.id).should.eventually.equal(3));
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/calls/3'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});

describe('When creating a call', () => {
  const client = new Client();

  beforeEach(() => mockCalls.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Call(client, { code: 'SYNC', initiating_user: { href: '/1/users/1' } }).create();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/calls/3'));
  it('should set the ID', () => promise.then(v => v.id).should.eventually.equal(3));
});

describe('When updating a call', () => {
  const client = new Client();

  beforeEach(() => mockCalls.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Call(client, { code: 'SYNC', initiating_user: { href: '/1/users/1' } })
      .create()
      .then(call => call.end()
        .then(() => call));
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/calls/3'));
  it('should set ended to a date', () => promise.then(v => v.ended).should.eventually.be.a('string'));
});
