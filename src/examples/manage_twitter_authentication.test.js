import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import {
  charlie,
  twitter as mockTwitter,
  twitterOAuthRequests as mockTwitterRequests,
} from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When generating a twitter oauth request token', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockTwitterRequests.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should generate a request token', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const tokenPromise = api.customer('SYNC').twitterOAuthRequest()
      .fetch()
      .then(requestToken => requestToken);
      // do something with request token, likely redirect to twitter for a login.

    return tokenPromise;
  });
});

describe('When saving a twitter oauth token', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockTwitter.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should save a token', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const tokenPromise = api.customer('SYNC').twitterOAuth({
      username: 'GMVSyncromatics',
      token: 'example_oauth_token',
      secret: 'example_oauth_secret',
      profile_image_url: 'https://example.com/gmvsyncromatics.png',
    }).update().then(success => success); // check success

    return tokenPromise;
  });
});

describe('When retrieving the connected twitter username', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockTwitter.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should save a token', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const usernamePromise = api.customer('SYNC').twitterUsername()
      .fetch()
      .then(username => username); // Do things with username

    return usernamePromise;
  });
});
