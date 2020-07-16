import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import MessageChannel from './MessageChannel';
 import { messageChannels as mockMessageChannels } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a message channel based on customer and name', () => {
  const client = new Client();
  const messageChannel = new MessageChannel(client, MessageChannel.makeHref('SYNC', 'Signs'));

  it('should set the href', () => messageChannel.href.should.equal('/1/SYNC/message_channels/Signs'));
  it('should not be hydrated', () => messageChannel.hydrated.should.equal(false));
});

describe('When instantiating a message channel based on an object', () => {
  const client = new Client();
  const messageChannel = new MessageChannel(client, messageChannels.getByName('Signs'));

  it('should set the Name', () => messageChannel.name.should.equal('Signs'));
  it('should set the href', () => messageChannel.href.should.equal('/1/SYNC/message_channels/Signs'));
  it('should be hydrated', () => messageChannel.hydrated.should.equal(true));
});
