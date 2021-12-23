import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import { callLogs as mockCallLogs } from '../mocks';
import CallLogsContext from "./CallLogsContext";

chai.should();
chai.use(chaiAsPromised);

describe('When building a query for call logs', () => {
  const client = new Client();
  client.setAuthenticated();

  beforeEach(() => fetchMock
    .get(client.resolve('/1/SYNC/calls_historical?page=9&per_page=27&sort='), mockCallLogs.list)
    .catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const areas = new CallLogsContext(client, 'SYNC');
    promise = areas
      .withPage(9)
      .withPerPage(27)
      .getPage();
  });

  it('should make the expected request', () => promise.should.be.fulfilled);
});
