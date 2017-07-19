import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, externalApis as mockExternalApis } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When searching for external APIs by name', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockExternalApis.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a list of external APIs', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const externalApisPromise = api.externalApis()
      .withQuery('arr') // External APIs containing "arr" in their name
      .getPage()
      .then(page => page.list)
      .then(externalApis => externalApis); // Do things with list of external APIs

    return externalApisPromise;
  });
});

describe('When retrieving an external API by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockExternalApis.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get an external API', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const externalApiPromise = api.externalApi(1)
      .fetch()
      .then(externalApi => externalApi); // Do things with external API

    return externalApiPromise;
  });
});
