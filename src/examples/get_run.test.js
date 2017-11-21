import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, runs as mockRuns } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When retrieving a run by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockRuns.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a run', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const runPromise = api.customer('SYNC').run(1)
      .fetch()
      .then(run => run); // Do things with run

    return runPromise;
  });
});
