import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, users as mockUsers } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When retrieving a user by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockUsers.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a user', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const usersPromise = api.user(1)
      .fetch()
      .then(user => user); // Do things with user

    return usersPromise;
  });
});

describe('When retrieving the user for the authenticated session', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockUsers.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a user', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const usersPromise = api.user()
      .fetch()
      .then(user => user); // Do things with user

    return usersPromise;
  });
});
