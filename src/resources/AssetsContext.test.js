import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import AssetsContext from './AssetsContext';
import { assets as mockAssets } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When building a query for assets', () => {
  const client = new Client();
  client.setAuthenticated();

  beforeEach(() => fetchMock
    .get(client.resolve('/1/SYNC/assets?page=1&per_page=10&sort='), mockAssets.list)
    .catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const assets = new AssetsContext(client, 'SYNC');
    promise = assets
      .withPage(1)
      .withPerPage(10)
      .getPage();
  });

  it('should make the expected request', () => promise.should.be.fulfilled);
});
