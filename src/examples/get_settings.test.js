import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, settings as mockSettings } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When querying for customers settings', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockSettings.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get an object of type settings', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const settingsPromise = api.customer('SYNC').settings();

    return settingsPromise;
  });
});
