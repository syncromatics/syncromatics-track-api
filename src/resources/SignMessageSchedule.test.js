import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Client from '../Client';
import SignMessageSchedule from './SignMessageSchedule';
import { messageTemplates as mockMessageTemplates } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a sign message schedule based on an object', () => {
  const client = new Client();
  const mockSignMessageSchedule = mockMessageTemplates.getById(1).sign_messages[0].schedules[0];
  const signMessageSchedule = new SignMessageSchedule(client, mockSignMessageSchedule);

  it('should be hydrated', () => signMessageSchedule.hydrated.should.equal(true));
});
