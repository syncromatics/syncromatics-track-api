import chai from 'chai';
import fetchMock from 'fetch-mock';
import chaiAsPromised from 'chai-as-promised';
import Client from '../Client';
import MessageChannels from './MessageChannels';
import { messageChannels as mockMessageChannels } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a message channel based on customer and name', () => {
  const client = new Client();
  const messageChannels = new MessageChannels(client, MessageChannels.makeHref('SYNC'));

  it('should set the href', () => messageChannels.href.should.equal('/1/SYNC/message_channels'));
  it('should not be hydrated', () => messageChannels.hydrated.should.equal(false));
});

describe('When fetching message channels based on customer', () => {
  const client = new Client();

  beforeEach(() => mockMessageChannels.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new MessageChannels(client, MessageChannels.makeHref('SYNC')).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/message_channels'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});
