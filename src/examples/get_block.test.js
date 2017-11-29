import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, blocks as mockBlocks } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When retrieving a block by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockBlocks.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a block', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const blockPromise = api.customer('SYNC').block(1)
      .fetch()
      .then(block => block); // Do things with block

    return blockPromise;
  });
});
