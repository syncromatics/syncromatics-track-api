import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, roles as mockRoles } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When searching for roles', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockRoles.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a list of roles', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const rolesPromise = api.customer('SYNC').roles()
      .withQuery('Di') // Roles containing "Di" in their name
      .getPage()
      .then(page => page.list)
      .then(roles => roles); // Do things with list of roles

    return rolesPromise;
  });
});

describe('When retrieving a role by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockRoles.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a role', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const rolePromise = api.customer('SYNC')
      .role(2)
      .fetch()
      .then(role => role); // Do things with role

    return rolePromise;
  });
});

describe('When creating a role', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockRoles.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a role', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const rolePromise = api.customer('SYNC')
      .role({
        name: 'Junior Dispatcher',
      })
      .create()
      .then(role => role); // Do things with role

    return rolePromise;
  });
});

describe('When updating a role', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockRoles.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should update a role', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const rolePromise = api.customer('SYNC')
      .role(2)
      .fetch()
      .then((role) => {
        // eslint-disable-next-line no-param-reassign
        role.name = 'Limited User';
        return role.update();
      });

    return rolePromise;
  });
});
