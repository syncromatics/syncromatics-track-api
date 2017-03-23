import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, signs as mockSigns } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When searching for signs by name', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockSigns.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a list of signs', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const signsPromise = api.customer('SYNC').signs()
      .withQuery('first') // Signs containing "first" in their name
      .getPage()
      .then(page => page.list)
      .then(signs => signs); // Do things with list of signs

    return signsPromise;
  });
});

describe('When retrieving a sign by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockSigns.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a sign', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const signPromise = api.customer('SYNC').sign(1)
      .fetch()
      .then(sign => sign); // Do things with sign

    return signPromise;
  });
});
