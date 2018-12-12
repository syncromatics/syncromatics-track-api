import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Client from '../Client';
import SignMessage from './SignMessage';
import { messages as mockMessages } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a sign message based on an object', () => {
  const client = new Client();
  const mockSignMessage = mockMessages.getById(1).sign_messages[0];
  const signMessage = new SignMessage(client, mockSignMessage);

  it('should be hydrated', () => signMessage.hydrated.should.equal(true));
  it('should have override text', () => signMessage.override_text.should.equal(mockSignMessage.override_text));
});
