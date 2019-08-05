import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, users as mockUsers } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When searching for users', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockUsers.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should find a list of users', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const userPromise = api.customer('SYNC')
      .users()
      .withQuery('1st')
      .getPage()
      .then(page => page.list)
      .then(users => users); // Do things with users

    return userPromise;
  });
});

describe('When creating a user', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockUsers.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should create a user', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const userPromise = api
      .user({
        firstName: 'Charlie',
        lastName: 'Singh',
      })
      .create()
      .then(user => user); // Do things with user

    return userPromise;
  });
});

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

describe('When updating a user for the authenticated session', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockUsers.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should update a user', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const userPromise = api.user()
      .fetch()
      .then((user) => {
        // eslint-disable-next-line no-param-reassign
        user.firstName = 'updatedFirstName';
        return user.update();
      });

    return userPromise;
  });
});
