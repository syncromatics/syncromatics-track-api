import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';

import Client from '../Client';
import TwitterOAuthRequest from './TwitterOAuthRequest';
import { twitterOAuthRequests as mockRequests } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a TwitterOAuthRequest based on customer', () => {
  const client = new Client();
  const oauthRequest = new TwitterOAuthRequest(client, TwitterOAuthRequest.makeHref('SYNC'));

  it('should set the href', () => oauthRequest.href.should.equal('/1/SYNC/twitter/oauth/request'));
  it('should not be hydrated', () => oauthRequest.hydrated.should.equal(false));
});

describe('When fetching a new Twitter OAuth Request based on customer', () => {
  const client = new Client();

  beforeEach(() => mockRequests.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new TwitterOAuthRequest(client, TwitterOAuthRequest.makeHref('SYNC')).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/twitter/oauth/request'));
  it('should set the redirect_url', () => promise.then(v => v.redirect_url).should.eventually.equal('https://example.com'));
  it('should set the o_auth_token', () => promise.then(v => v.o_auth_token).should.eventually.equal('example_token'));
});
