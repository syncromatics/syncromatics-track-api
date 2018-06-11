import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import Settings from './Settings';
import { settings as mockSettings } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating settings based on customer', () => {
  const client = new Client();
  const settings = new Settings(client, Settings.makeHref('SYNC'));

  it('should set the href', () => settings.href.should.equal('/1/SYNC/settings'));
  it('should not be hydrated', () => settings.hydrated.should.equal(false));
});

describe('When instantiating settings based on an object', () => {
  const client = new Client();
  const settings = new Settings(client, mockSettings.get());

  it('should set the href', () => settings.href.should.equal('/1/SYNC/settings'));
  it('should be hydrated', () => settings.hydrated.should.equal(true));
});

describe('When fetching settings based on customer', () => {
  const client = new Client();

  beforeEach(() => mockSettings.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Settings(client, Settings.makeHref('SYNC')).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/settings'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});
