import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Client from '../Client';
import SignMessage from './SignMessage';
import Route from './Route';
import Sign from './Sign';
import SignMessageSchedule from './SignMessageSchedule';
import Stop from './Stop';
import Tag from './Tag';
import { messageTemplates as mockMessageTemplates } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a sign message based on an object', () => {
  const client = new Client();
  const mockSignMessage = mockMessageTemplates.getById(1).sign_messages[0];
  const signMessage = new SignMessage(client, mockSignMessage);

  it('should be hydrated', () => signMessage.hydrated.should.equal(true));
  it('should have override text', () => signMessage.override_text.should.equal(mockSignMessage.override_text));
  it('should have routes', () => signMessage.routes[0].should.be.an.instanceof(Route));
  it('should have schedules', () => signMessage.schedules[0].should.be.an.instanceof(SignMessageSchedule));
  it('should have signs', () => signMessage.signs[0].should.be.an.instanceof(Sign));
  it('should have stops', () => signMessage.stops[0].should.be.an.instanceof(Stop));
  it('should have tags', () => signMessage.tags[0].should.be.an.instanceof(Tag));
});
