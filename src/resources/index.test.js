import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from './index';
import { ForbiddenResponse } from '../responses';
import { toBlob, resolveAt } from '../testutils';
import { charlie } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When successfully authenticating with the Track API client', () => {
  const api = new Track();

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);
  afterEach(() => api.stopAutoRenew());

  it('should successfully log in with a token', () => {
    const promise = api.logIn({ token: 'whatever' });
    return Promise.all([
      promise.should.become(charlie.payload),
      promise.then(() => fetchMock.lastOptions().headers).should.become({
        Accept: 'application/json',
        Authorization: 'Bearer whatever',
      }),
    ]).should.be.fulfilled;
  });

  it('should successfully log in with an API key', () => {
    const promise = api.logIn({ apiKey: 'whatever' });
    return Promise.all([
      promise.should.become(charlie.payload),
      promise.then(() => fetchMock.lastOptions().headers).should.become({
        Accept: 'application/json',
        'Api-Key': 'whatever',
      }),
    ]).should.be.fulfilled;
  });

  it('should successfully log in with a username and password', () => {
    const promise = api.logIn({ username: charlie.payload.sub, password: 'whatever' });
    return Promise.all([
      promise.should.become(charlie.payload),
      promise.then(() => fetchMock.lastOptions().headers).should.become({
        Accept: 'application/json',
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
        Accept: 'application/json',
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

describe('When unsuccessfully authenticating with the Track API client', () => {
  const api = new Track();

  beforeEach(() => {
    fetchMock
      .post(api.client.resolve('/1/login'), () => new Response(toBlob('', s => s, 'plain/text'), { status: 403 }))
      .post(api.client.resolve('/1/login/renew'), () => new Response(toBlob('', s => s, 'plain/text'), { status: 403 }))
      .catch(503);

    api.stopAutoRenew();
  });
  afterEach(() => api.stopAutoRenew());
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

  it('should not auto renew authentication', () => {
    const promise = api.logIn({ username: charlie.payload.sub, password: 'whatever' });
    return Promise.all([
      promise.should.be.rejected,
      promise.catch(() => resolveAt(() => fetchMock.calls().matched.length, 1000))
        .should.eventually.equal(1),
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
      promise.catch(err => err.message).should.become('Not logged in. Call logIn() first.'),
    ]).should.be.fulfilled;
  });

  it('should stop auto renewal', () => {
    const callsAsOfBeforeLoggingOut = api.logIn({ username: charlie.payload.sub, password: 'whatever' })
      .then(() => resolveAt(() => api.logOut(), 500))
      .then(() => fetchMock.calls().matched.length);
    const callsAsOfAfterLoggingOut = resolveAt(() => fetchMock.calls().matched.length, 1000);
    return Promise.all([
      callsAsOfBeforeLoggingOut.should.eventually.be.above(1),
      Promise.all([callsAsOfBeforeLoggingOut, callsAsOfAfterLoggingOut])
        .then(([callsAsOfBefore, callsAsOfAfter]) => callsAsOfAfter - callsAsOfBefore)
        .should.eventually.equal(0),
    ]);
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
