import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, patterns as mockPatterns } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When getting a pattern for use in the Sync route editor', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockPatterns.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should return a pattern compatible with the Sync route editor', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });
    fetchMock.get('/1/SYNC/patterns/editor/1', {
      status: 200,
    });

    const getPatternForSyncRouteEditorPromise = api.customer('SYNC').patterns()
        .getPatternForSyncRouteEditor(1)
        .then(getPatternResponse => {
          getPatternResponse.should.be.an('object');
        });
    return getPatternForSyncRouteEditorPromise;
  });
});