import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Client from '../Client';
import CallLog from './CallLog';
import {callLogs as mockCallLogs} from '../mocks';


chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a call log based on customer and ID', () => {
  const client = new Client();
  const callLog = new CallLog(client, CallLog.makeHref('SYNC', 33));

  it('should set the href', () => callLog.href.should.equal('/1/SYNC/calls_historical/33'));
  it('should not be hydrated', () => callLog.hydrated.should.equal(false));
});

describe('When instantiating a call log based on an object', () => {
    const client = new Client();
    const callLog = new CallLog(client, mockCallLogs.getById(33));

    it('should set the ID', () => callLog.conferenceId.should.equal(33));
    it('should set the href', () => callLog.href.should.equal('/1/SYNC/calls_historical/33'));
    it('should be hydrated', () => callLog.hydrated.should.equal(true));
    it('should have the expected call duration', () => callLog.callDuration.should.equal('00:01:01.000'));
});