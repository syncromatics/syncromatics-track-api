import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import {charlie, voipCallRecords as mockVoipCallRecords} from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When retrieving voip call records', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockVoipCallRecords.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a list of voip call records', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const voipCallRecordsPromise = api.customer('SYNC').voipCallRecords()
        .getPage()
        .then(page => page.list)
        .then(voipCallRecords => voipCallRecords); // Do things with list of voipCallRecords

    return voipCallRecordsPromise;
  });
});

describe('When retrieving a voip call record by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockVoipCallRecords.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a voip call record', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const voipCallRecordPromise = api.customer('SYNC').voipCallRecord(33)
      .fetch()
      .then(voipCallRecord => voipCallRecord); // Do things with voip call record

    return voipCallRecordPromise;
  });
});
