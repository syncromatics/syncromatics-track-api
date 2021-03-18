import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, riderAppConfiguration as mocks } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When retrieving a rider app configuration', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mocks.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a the configuration', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const configPromise = api.customer('SYNC').riderAppConfiguration()
      .fetch()
      .then(config => config); // Do things with config

    return configPromise;
  });
});

describe('When updating a rider app configuration', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mocks.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should update the configuration', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const configPromise = api.customer('SYNC').riderAppConfiguration()
      .fetch()
      .then((config) => {
        // eslint-disable-next-line no-param-reassign
        config.spash_image_url = 'https://example.com/updated.png';
        return config.update();
      });

    return configPromise;
  });
});
