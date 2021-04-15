import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import RiderAppConfiguration from './RiderAppConfiguration';
import { riderAppConfiguration as mocks } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a Rider App Configuration based on customer', () => {
  const client = new Client();
  const config = new RiderAppConfiguration(client, RiderAppConfiguration.makeHref('SYNC'));

  it('should set the href', () => config.href.should.equal('/1/SYNC/rider_app_configuration'));
  it('should not be hydrated', () => config.hydrated.should.equal(false));
});

describe('When instantiating a Rider App Configuration based on an object', () => {
  const client = new Client();
  const config = new RiderAppConfiguration(client, mocks.rawObject);

  it('should set the href', () => config.href.should.equal('/1/SYNC/rider_app_configuration'));
  it('should set the splash image url', () => config.splash_image_url.should.equal('https://example.com/logo.png'));
  it('should set the accent color', () => config.accent_color.should.equal('#ABCDEF'));
  it('should be hydrated', () => config.hydrated.should.equal(true));
});

describe('When fetching a Rider App Configuration based on customer', () => {
  const client = new Client();

  beforeEach(() => mocks.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new RiderAppConfiguration(client, RiderAppConfiguration.makeHref('SYNC')).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/rider_app_configuration'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});

describe('When updating a Rider App Configuration for a customer', () => {
  const client = new Client();

  beforeEach(() => mocks.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const config = new RiderAppConfiguration(client, RiderAppConfiguration.makeHref('SYNC'));
    config.splash_image_url = 'https://example.com/logo.png';
    config.accent_color = '#ABCDEF';
    promise = config.update();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/rider_app_configuration'));
});
