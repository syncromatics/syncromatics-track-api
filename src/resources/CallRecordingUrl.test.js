import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import CallRecordingUrl from './CallRecordingUrl';
import { callRecordingUrls as mockCalls } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When fetching a call recording url based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mockCalls.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new CallRecordingUrl(client, CallRecordingUrl.makeHref('SYNC', 33)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/calls/33/recording'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});
