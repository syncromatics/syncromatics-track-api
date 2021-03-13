import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, assets as mockAssets } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When searching for assets by name', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockAssets.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a list of assets', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const assetsPromise = api.customer('SYNC').assets()
      .getPage()
      .then(page => page.list)
      .then(assets => assets); // Do things with list of assets

    return assetsPromise;
  });
});

describe('When retrieving an asset by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockAssets.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get an asset', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const assetPromise = api.customer('SYNC').asset(1)
      .fetch()
      .then(asset => asset); // Do things with asset

    return assetPromise;
  });
});

describe('When creating an asset', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockAssets.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should create an asset', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const assetPromise = api.customer('SYNC').asset({
      base64_data: 'some_data',
      asset_type: 'Logo',
      filename: 'logo.png',
    })
      .create()
      .then(asset => asset); // Do things with asset

    return assetPromise;
  });
});

describe('When marking an asset saved', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockAssets.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should mark the asset saved', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const assetPromise = api.customer('SYNC').asset(1)
      .fetch()
      .then(asset => asset.markSaved());

    return assetPromise;
  });
});
