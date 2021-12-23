import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import CallLog from './CallLog';
import { callLogs as mockCalls } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When fetching a call log based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mockCalls.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new CallLog(client, CallLog.makeHref('SYNC', 33)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(v => v.conferenceId).should.eventually.equal(33));
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/calls_historical/33'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});
