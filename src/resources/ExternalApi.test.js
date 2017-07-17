import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import ExternalApi from './ExternalApi';
import { externalApis as mockExternalApis } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating an external API based on customer and ID', () => {
  const client = new Client();
  const externalApi = new ExternalApi(client, ExternalApi.makeHref('SYNC', 1));

  it('should set the href', () => externalApi.href.should.equal('/1/SYNC/external_apis/1'));
  it('should not be hydrated', () => externalApi.hydrated.should.equal(false));
});

describe('When instantiating an external API based on an object', () => {
  const client = new Client();
  const externalApi = new ExternalApi(client, mockExternalApis.getById(1));

  it('should set the ID', () => externalApi.id.should.equal(1));
  it('should set the href', () => externalApi.href.should.equal('/1/SYNC/external_apis/1'));
  it('should be hydrated', () => externalApi.hydrated.should.equal(true));
});

describe('When fetching an external API best on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mockExternalApis.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new ExternalApi(client, ExternalApi.makeHref('SYNC', 1)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(e => e.id).should.eventually.equal(1));
  it('should set the href', () => promise.then(e => e.href).should.eventually.equal('/1/SYNC/external_apis/1'));
  it('should be hydrated', () => promise.then(p => p.hydrated).should.eventually.equal(true));
});
