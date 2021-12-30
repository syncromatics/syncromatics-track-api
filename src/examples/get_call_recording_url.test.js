import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import {charlie} from '../mocks';
import callRecordingUrls from "../mocks/callRecordingUrls";

chai.should();
chai.use(chaiAsPromised);

describe('When retrieving a call recording url by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => callRecordingUrls.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a call recording url', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const callRecordingUrlPromise = api.customer('SYNC').callRecordingUrl(33)
      .fetch()
      .then(callRecordingUrl => callRecordingUrl); // Do things with call recording url

    return callRecordingUrlPromise;
  });
});
