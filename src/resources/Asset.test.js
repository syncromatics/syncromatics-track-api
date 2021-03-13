import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import Asset from './Asset';
import { assets as mockAssets } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating an asset based on customer and ID', () => {
  const client = new Client();
  const asset = new Asset(client, Asset.makeHref('SYNC', 1));

  it('should set the href', () => asset.href.should.equal('/1/SYNC/assets/1'));
  it('should not be hydrated', () => asset.hydrated.should.equal(false));
});

describe('When instantiating an asset based on an object', () => {
  const client = new Client();
  const asset = new Asset(client, mockAssets.getById(1));

  it('should set the ID', () => asset.id.should.equal(1));
  it('should set the href', () => asset.href.should.equal('/1/SYNC/assets/1'));
  it('should be hydrated', () => asset.hydrated.should.equal(true));
});

describe('When fetching an asset based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mockAssets.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Asset(client, Asset.makeHref('SYNC', 1)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(v => v.id).should.eventually.equal(1));
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/assets/1'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});

describe('When creating an asset', () => {
  const client = new Client();

  beforeEach(() => mockAssets.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Asset(client, { code: 'SYNC', base64_data: 'some_data' }).create();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/assets/1'));
  it('should set the ID', () => promise.then(v => v.id).should.eventually.equal(1));
});

describe('When updating an asset', () => {
  const client = new Client();

  beforeEach(() => mockAssets.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Asset(client, { code: 'SYNC' })
      .create()
      .then(asset => asset.markSaved()
        .then(() => asset));
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/assets/1'));
  it('should set is_saved to true', () => promise.then(v => v.is_saved).should.eventually.equal(true));
});
