import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import { voipCallRecords as mockVoipCallRecords } from '../mocks';
import VoipCallRecordsContext from "./VoipCallRecordsContext";

chai.should();
chai.use(chaiAsPromised);

describe('When building a query for voip call records', () => {
  const client = new Client();
  client.setAuthenticated();

  beforeEach(() => fetchMock
    .get(client.resolve('/1/SYNC/calls_historical?page=9&per_page=27&sort='), mockVoipCallRecords.list)
    .catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const areas = new VoipCallRecordsContext(client, 'SYNC');
    promise = areas
      .withPage(9)
      .withPerPage(27)
      .getPage();
  });

  it('should make the expected request', () => promise.should.be.fulfilled);
});
