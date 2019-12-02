import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Client from '../Client';
import EnplugScreenshot from './EnplugScreenshot';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating an enplug screenshot based on customer and enplug serial', () => {
  const client = new Client();
  const enplugScreenshot = new EnplugScreenshot(client, EnplugScreenshot.makeHref('SYNC', 'SERIAL11'));

  it('should set the href', () => enplugScreenshot.href.should.equal('/1/SYNC/enplugs/SERIAL11/screenshot'));
  it('should not be hydrated', () => enplugScreenshot.hydrated.should.equal(false));
});
