import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, realTime as realTimeMocks } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When subscribing to presence', () => {
  let server;
  const api = new Track({
    autoRenew: false,
    reconnectOnClose: false,
    ...realTimeMocks.options,
  });

  before(() => { server = realTimeMocks.getServer(); });
  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));

  afterEach(fetchMock.restore);
  after(() => server.close());

  it('should get updates and deletes for a single user', () => {
    const userHref = '/1/users/123';

    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });
    return api.customer('SYNC')
      .realTime()
      .presence()
      .forUser(userHref)
      .on('update', response => response.data) // do things with presence
      .on('delete', response => response.hrefs) // do things with removed users
      .start();
  });

  it('should get updates and deletes for multiple users', () => {
    const userHrefs = ['/1/users/123', '/1/users/456'];

    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });
    return api.customer('SYNC')
      .realTime()
      .presence()
      .forUsers(userHrefs)
      .on('update', response => response.data) // do things with presence
      .on('delete', response => response.hrefs) // do things with removed users
      .start();
  });

  it('should get updates and deletes for a customer', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });
    return api.customer('SYNC')
      .realTime()
      .presence()
      .on('update', response => response.data) // do things with presence
      .on('delete', response => response.hrefs) // do things with removed users
      .start();
  });
});
