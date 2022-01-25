import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Client from '../Client';
import VoipCallRecord from './VoipCallRecord';
import {voipCallRecords as mockVoipCallRecords} from '../mocks';


chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a voip call record based on customer and ID', () => {
  const client = new Client();
  const voipCallRecord = new VoipCallRecord(client, VoipCallRecord.makeHref('SYNC', 33));

  it('should set the href', () => voipCallRecord.href.should.equal('/1/SYNC/calls_historical/33'));
  it('should not be hydrated', () => voipCallRecord.hydrated.should.equal(false));
});

describe('When instantiating a voip call record based on an object', () => {
    const client = new Client();
    const voipCallRecord = new VoipCallRecord(client, mockVoipCallRecords.getById(33));

    it('should set the ID', () => voipCallRecord.conferenceId.should.equal(33));
    it('should set the href', () => voipCallRecord.href.should.equal('/1/SYNC/calls_historical/33'));
    it('should be hydrated', () => voipCallRecord.hydrated.should.equal(true));
    it('should have the expected call duration', () => voipCallRecord.callDuration.should.equal('00:01:01.000'));
});