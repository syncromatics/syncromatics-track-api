import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';

import Client from '../Client';
import TwitterOAuth from './TwitterOAuth';
import { twitter as mockTwitter } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a TwitterOAuth based on customer', () => {
  const client = new Client();
  const oauth = new TwitterOAuth(client, TwitterOAuth.makeHref('SYNC'));

  it('should set the href', () => oauth.href.should.equal('/1/SYNC/twitter/oauth'));
  it('should not be hydrated', () => oauth.hydrated.should.equal(false));
});

describe('When updating an TwitterOAuth information for a customer', () => {
  const client = new Client();

  beforeEach(() => mockTwitter.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const oauth = new TwitterOAuth(client, {
      code: 'SYNC',
      username: 'GMVSyncromatics',
      token: 'example_oauth_token',
      secret: 'example_oauth_secret',
      profile_image_url: 'https://example.com/gmvsyncromatics.png',
    });
    promise = oauth.update().then(updated => updated);
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should return success', () => promise.then(v => v.success).should.eventually.equal(true));
});
