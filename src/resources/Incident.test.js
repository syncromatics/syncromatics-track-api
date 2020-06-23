import chai from 'chai';
import fetchMock from 'fetch-mock';
import chaiAsPromised from 'chai-as-promised';
import Client from '../Client';
import Incident from './Incident';
import { incidents as mockIncidents } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating an incident based on ID', () => {
  const client = new Client();
  const incident = new Incident(client, Incident.makeHref('SYNC', 1));
  it('should set the href', () => incident.href.should.equal('/1/SYNC/incidents/1'));
  it('should not be hydrated', () => incident.hydrated.should.equal(false));
});


describe('When instantiating an incident based on an object', () => {
  const client = new Client();
  const incident = new Incident(client, mockIncidents.getById(1));

  it('should set the ID', () => incident.id.should.equal(1));
  it('should set the href', () => incident.href.should.equal('/1/SYNC/incidents/1'));
  it('should be hydrated', () => incident.hydrated.should.equal(true));
});

describe('When claim an unclaimed incident', () => {
  const client = new Client();
  beforeEach(() => mockIncidents.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);
  let promise;
  beforeEach(() => {
    promise = new Incident(client, Incident.makeHref('SYNC', 1)).claim();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
});


describe('When add note to an incident', () => {
  const client = new Client();
  beforeEach(() => mockIncidents.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);
  let promise;
  beforeEach(() => {
    promise = new Incident(client, Incident.makeHref('SYNC', 1)).addNote('this is the note');
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
});

describe('When disposing an incident', () => {
  const client = new Client();
  beforeEach(() => mockIncidents.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);
  beforeEach(() => {
  });

  it('should resolve the promise with false alarm', () => {
    const promise = new Incident(client, Incident.makeHref('SYNC', 1)).dispose('FalseAlarm');
    return promise.should.be.fulfilled;
  });
  it('should resolve the promise with Cleared', () => {
    const promise = new Incident(client, Incident.makeHref('SYNC', 1)).dispose('Cleared');
    return promise.should.be.fulfilled;
  });
});
