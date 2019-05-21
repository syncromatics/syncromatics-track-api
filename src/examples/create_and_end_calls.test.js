import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, calls as mockCalls } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When retrieving a call by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockCalls.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a call', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const callPromise = api.customer('SYNC').call(3)
      .fetch()
      .then(call => call); // Do things with call

    return callPromise;
  });
});

describe('When creating a call', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockCalls.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should create a call', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const callPromise = api.customer('SYNC').call({ initiating_user: '/1/users/1' })
      .create()
      .then(call => call); // Do things with call

    return callPromise;
  });
});

describe('When ending a call', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockCalls.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should end a call', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const callPromise = api.customer('SYNC').call(3)
      .fetch()
      .then(call => call.end());

    return callPromise;
  });
});
