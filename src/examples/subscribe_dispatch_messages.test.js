import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, realTime as realTimeMocks } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When subscribing to dispatch messages', () => {
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

  it('should get updated dispatch messages for a single driver', () => {
    const driverHref = '1/SYNC/drivers/123';

    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });
    return api.customer('SYNC')
      .realTime()
      .dispatchMessages()
      .forDriver(driverHref)
      .on('update', response => response.data); // do things with dispatch messages
  });

  it('should get updated dispatch messages for multiple drivers', () => {
    const drivers = [
      { href: '1/SYNC/drivers/123' },
      { href: '1/SYNC/drivers/456' },
      { href: '1/SYNC/drivers/789' },
    ];

    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });
    return api.customer('SYNC')
      .realTime()
      .dispatchMessages()
      .forDrivers(drivers)
      .on('update', response => response.data); // do things with dispatch messages
  });
});
