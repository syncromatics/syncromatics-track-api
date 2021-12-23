import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, callLogs as mockCallLogs } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When retrieving call logs', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockDrivers.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a list of call logs', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const callLogsPromise = api.customer('SYNC').callLogs()
      .then(callLogs => callLogs); // Do things with list of callLogs

    return callLogsPromise;
  });
});

describe('When retrieving a call log by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockDrivers.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a call log', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const callLogPromise = api.customer('SYNC').driver(1)
      .fetch()
      .then(driver => driver); // Do things with driver

    return callLogPromise;
  });
});
