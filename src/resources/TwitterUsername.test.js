import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';

import Client from '../Client';
import TwitterUsername from './TwitterUsername';
import { twitter as mockTwitter } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a TwitterUsername based on customer', () => {
  const client = new Client();
  const oauth = new TwitterUsername(client, TwitterUsername.makeHref('SYNC'));

  it('should set the href', () => oauth.href.should.equal('/1/SYNC/twitter/username'));
  it('should not be hydrated', () => oauth.hydrated.should.equal(false));
});

describe('When fetching a TwitterUsername for a customer', () => {
  const client = new Client();

  beforeEach(() => mockTwitter.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new TwitterUsername(client, TwitterUsername.makeHref('SYNC'))
      .fetch()
      .then(username => username);
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/twitter/username'));
  it('should set the username', () => promise.then(v => v.username).should.eventually.equal('GMVSYNC'));
  it('should set is_valid', () => promise.then(v => v.is_valid).should.eventually.equal(true));
  it('should set the profile image url', () => promise.then(v => v.profile_image_url).should.eventually.equal('https://example.com/gmvsync.png'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});
