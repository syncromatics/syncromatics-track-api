import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from './index';
import { ForbiddenResponse } from '../responses';
import { resolveAt } from '../testutils';
import Client from '../Client';
import { charlie, users as mockUsers } from '../mocks';
import ExternalApi from './ExternalApi';
import ExternalApisContext from './ExternalApisContext';
import Role from './Role';
import RolesContext from './RolesContext';

chai.should();
chai.use(chaiAsPromised);

describe('When unsuccessfully authenticating with the Track API client', () => {
  const api = new Track();
  beforeEach(() => {
    fetchMock
      .post(api.client.resolve('/1/login'), () => new Response(Client.toBlob('', s => s, 'text/plain'), { status: 403 }))
      .post(api.client.resolve('/1/login/renew'), () => new Response(Client.toBlob('', s => s, 'text/plain'), { status: 403 }))
      .catch(503);
  });
  afterEach(fetchMock.restore);

  it('should fail to log in with a token', () => {
    const promise = api.logIn({ token: 'whatever' });
    return Promise.all([
      promise.should.be.rejected,
      promise.catch(err => ({
        isCorrectType: err instanceof ForbiddenResponse,
        message: err.message,
      })).should.become({
        isCorrectType: true,
        message: 'Invalid credentials',
      }),
    ]).should.be.fulfilled;
  });

  it('should fail to manually renew authentication', () => {
    const promise = api.logIn({ username: charlie.payload.sub, password: 'whatever' })
      .catch()
      .then(() => api.renewAuthentication());
    return Promise.all([
      promise.should.be.rejected,
      promise.catch(err => ({
        isCorrectType: err instanceof ForbiddenResponse,
        message: err.message,
      })).should.become({
        isCorrectType: true,
        message: 'Invalid credentials',
      }),
    ]).should.be.fulfilled;
  });

  it('should not auto renew authentication', async () => {

    const promise = api.logIn({ username: charlie.payload.sub, password: 'whatever' });

    return Promise.all([
      promise.should.be.rejected,
      promise.catch(() => resolveAt(() => fetchMock.calls().matched.length, 1000)).should.eventually.equal(1),
    ]).should.be.fulfilled;
  });
});

describe('When successfully authenticating with the Track API client', () => {
  let api;

  beforeEach(() => {
    api = new Track();
    charlie.setUpSuccessfulMock(api.client);
    fetchMock.catch(503);
  });

  afterEach(fetchMock.restore);
  afterEach(() => api.stopAutoRenew());

  it('should successfully log in with a token', () => {
    const promise = api.logIn({ token: 'whatever' });

    return Promise.all([
      promise.should.become(charlie.payload),
      promise.then(() => fetchMock.lastOptions().headers).should.become({
        'Content-Type': 'application/json',
        Accept: 'text/plain',
        Authorization: 'Bearer whatever',
      }),
    ]).should.be.fulfilled.then(() => {
      api.logOut();
    });
  });

  it('should successfully log in with an API key', () => {
    const promise = api.logIn({ apiKey: 'whatever' });
    return Promise.all([
      promise.should.become(charlie.payload),
      promise.then(() => fetchMock.lastOptions().headers).should.become({
        'Content-Type': 'application/json',
        Accept: 'text/plain',
        'Api-Key': 'whatever',
      }),
    ]).should.be.fulfilled.then(() => {
      api.logOut();
    });
  });

  it('should successfully log in with a username and password', () => {
    const promise = api.logIn({ username: charlie.payload.sub, password: 'whatever' });
    return Promise.all([
      promise.should.become(charlie.payload),
      promise.then(() => fetchMock.lastOptions().headers).should.become({
        'Content-Type': 'application/json',
        Accept: 'text/plain',
        Authorization: 'Basic Y3NpbmdoQGV4YW1wbGUuY29tOndoYXRldmVy',
      }),
    ]).should.be.fulfilled;
  });

  it('should successfully manually renew authentication', () => {
    const promise = api.logIn({ username: charlie.payload.sub, password: 'whatever' })
      .then(() => api.renewAuthentication());
    return Promise.all([
      promise.should.become(charlie.payload),
      promise.then(() => fetchMock.lastOptions().headers).should.become({
        'Content-Type': 'application/json',
        Accept: 'text/plain',
        Authorization: `Bearer ${charlie.token}`,
      }),
    ]).should.be.fulfilled;
  });

  it('should successfully auto renew authentication', () => {
    const promise = api.logIn({ username: charlie.payload.sub, password: 'whatever' });
    return Promise.all([
      promise.should.become(charlie.payload),
      promise.then(() => resolveAt(() => fetchMock.calls().matched.length, 1000))
        .should.eventually.be.above(1),
    ]).should.be.fulfilled;
  });
});

describe('When unauthenticating with the Track API client', () => {
  const api = new Track();

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);
  afterEach(() => api.stopAutoRenew());

  it('should no longer allow manual renewal', () => {
    const promise = api.logIn({ username: charlie.payload.sub, password: 'whatever' })
      .then(() => api.logOut())
      .then(() => api.renewAuthentication());
    return Promise.all([
      promise.should.be.rejected,
      promise.catch(err => err.message).should.become('Not logged in.'),
    ]).should.be.fulfilled;
  });

  it('should stop auto renewal', () => {
    let callsRightAfterLoggingOut;
    let callsSomeTimeAfterLoggingOut;
    const comparePromise = api.logIn({ username: charlie.payload.sub, password: 'whatever' })
      .then(() => resolveAt(() => {
        api.logOut();
        callsRightAfterLoggingOut = fetchMock.calls().matched.length;
      }, 500))
      .then(() => resolveAt(() => {
        callsSomeTimeAfterLoggingOut = fetchMock.calls().matched.length;
      }, 1000))
      .then(() => (callsRightAfterLoggingOut - callsSomeTimeAfterLoggingOut));
    comparePromise.should.eventually.equal(0);
    return comparePromise.should.be.fulfilled;
  });
});

describe('When getting a list of customer codes within the authenticated session', () => {
  const api = new Track();

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);
  afterEach(() => api.stopAutoRenew());

  it('should successfully get a customer by its code', () => {
    api.logIn({ username: charlie.payload.sub, password: 'whatever' });

    const customers = api.customers();
    return Promise.all([
      customers.should.be.fulfilled,
      customers.should.eventually.deep.equal([
        {
          code: 'SYNC',
          name: 'Syncromatics',
        },
      ]),
    ]).should.be.fulfilled;
  });
});

describe('When getting a customer within the authenticated session', () => {
  const api = new Track();

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);
  afterEach(() => api.stopAutoRenew());

  it('should successfully get a customer by its code', () => {
    const customer = api.logIn({ username: charlie.payload.sub, password: 'whatever' })
      .then(() => api.customer('SYNC'));
    return Promise.all([
      customer.should.be.fulfilled,
    ]).should.be.fulfilled;
  });
});

describe('When getting the user associated with the authenticated session', () => {
  const api = new Track();

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockUsers.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);
  afterEach(() => api.stopAutoRenew());

  it('should successfully get the user', () => {
    const user = api.logIn({ username: charlie.payload.sub, password: 'whatever' })
      .then(() => api.user().fetch());

    return Promise.all([
      user.should.be.fulfilled,
    ]).should.be.fulfilled;
  });
});

describe('When getting a user', () => {
  const api = new Track();

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockUsers.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);
  afterEach(() => api.stopAutoRenew());

  it('should successfully get the user', () => {
    const user = api.logIn({ username: charlie.payload.sub, password: 'whatever' })
      .then(() => api.user(1).fetch());

    return Promise.all([
      user.should.be.fulfilled,
    ]).should.be.fulfilled;
  });
});

describe('When accessing external APIs', () => {
  const api = new Track();

  it('should allow external apis to be searched', () => api.externalApis().should.be.instanceOf(ExternalApisContext));
  it('should allow an external api to be retrieved', () => api.externalApi().should.be.instanceOf(ExternalApi));
});

describe('When accessing user roles', () => {
  const api = new Track();

  it('should allow roles to be searched', () => api.roles().should.be.instanceOf(RolesContext));
  it('should allow a role to be retrieved', () => api.role().should.be.instanceOf(Role));
});