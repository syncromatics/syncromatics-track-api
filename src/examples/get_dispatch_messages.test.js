import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, dispatchMessages as mocks } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When searching for dispatch messages', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mocks.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a list of dispatch messages by text', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const dispatchMessagesPromise = api.customer('SYNC').dispatchMessages()
      .withQuery('chatter')
      .getPage()
      .then(page => page.list)
      .then(dispatchMessages => dispatchMessages); // Do things with list of dispatch messages

    return dispatchMessagesPromise;
  });

  it('should get a list of dispatch messages with any parameter', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    // any combination of these search parameters is valid
    const dispatchMessagesPromise = api.customer('SYNC').dispatchMessages()
      .withQuery('chatter')
      .forDriver(1)
      .forVehicle(1)
      .sinceDate('2000-01-01')
      .beforeDate('2000-01-31')
      .getPage()
      .then(page => page.list)
      .then(dispatchMessages => dispatchMessages); // Do things with list of dispatch messages

    return dispatchMessagesPromise;
  });
});


describe('When retrieving a dispatch message by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mocks.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a dispatch message', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const dispatchMessagePromise = api.customer('SYNC').dispatchMessage(3)
      .fetch()
      .then(dispatchMessage => dispatchMessage); // Do things with dispatch message

    return dispatchMessagePromise;
  });
});

describe('When creating a dispatch message', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mocks.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should save a dispatch message', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const dispatchMessagePromise = api.customer('SYNC').dispatchMessage({
      vehicle: { href: '/1/SYNC/vehicles/1' },
      driver: { href: '/1/SYNC/drivers/1' },
      message_direction: 'FromDispatch',
      pattern: { href: '/1/SYNC/patterns/1' },
      dispatch_user: { href: '/1/users/1' },
      customerId: 1,
      message: 'Radio chatter',
    })
      .create()
      .then(dispatchMessage => dispatchMessage); // Do things with dispatchMessage

    return dispatchMessagePromise;
  });
});
