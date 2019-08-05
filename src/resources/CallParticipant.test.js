import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import CallParticipant from './CallParticipant';
import { callParticipants as mockParticipants } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a call participant based on customer and IDs', () => {
  const client = new Client();
  const callParticipant = new CallParticipant(client, CallParticipant.makeHref('SYNC', 2, 3));

  it('should set the href', () => callParticipant.href.should.equal('/1/SYNC/calls/2/participants/3'));
  it('should not be hydrated', () => callParticipant.hydrated.should.equal(false));
});

describe('When instantiating a call participant based on an object', () => {
  const client = new Client();
  const callParticipant = new CallParticipant(client, mockParticipants.getById(2, 3));

  it('should set the ID', () => callParticipant.id.should.equal(3));
  it('should set the href', () => callParticipant.href.should.equal('/1/SYNC/calls/2/participants/3'));
  it('should be hydrated', () => callParticipant.hydrated.should.equal(true));
});

describe('When fetching a call participant based on customer and IDs', () => {
  const client = new Client();

  beforeEach(() => mockParticipants.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new CallParticipant(client, CallParticipant.makeHref('SYNC', 2, 3)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(v => v.id).should.eventually.equal(3));
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/calls/2/participants/3'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});

describe('When adding a call participant', () => {
  const client = new Client();

  beforeEach(() => mockParticipants.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new CallParticipant(client, { code: 'SYNC', callId: 2, user: '/1/SYNC/users/1' }).create();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/calls/2/participants/3'));
  it('should set the ID', () => promise.then(v => v.id).should.eventually.equal(3));
});

describe('When updating a call participant', () => {
  const client = new Client();

  beforeEach(() => mockParticipants.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new CallParticipant(client, { code: 'SYNC', callId: 2, user: '/1/SYNC/users/1' })
      .create()
      .then(participant => participant.end()
        .then(() => participant));
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/calls/2/participants/3'));
  it('should set connection_terminated to a date', () => promise.then(v => v.connection_terminated).should.eventually.be.a('string'));
});

