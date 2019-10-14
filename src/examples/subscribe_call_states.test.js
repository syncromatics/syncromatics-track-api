import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, realTime as realTimeMocks } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When subscribing to call states', () => {
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

  it('should get updated call states for a single vehicle and all users', () => {
    const vehicleHref = '1/SYNC/vehicles/123';

    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });
    return api.customer('SYNC')
      .realTime()
      .callStates()
      .forVehicle(vehicleHref)
      .on('update', callState => callState); // do things with callState
  });

  it('should get updated call states for multiple vehicles and a single user', () => {
    const vehicles = [
      { href: '1/SYNC/vehicles/123' },
      { href: '1/SYNC/vehicles/456' },
      { href: '1/SYNC/vehicles/789' },
    ];
    const user = { href: '1/SYNC/users/1' };

    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });
    return api.customer('SYNC')
      .realTime()
      .callStates()
      .forVehicles(vehicles)
      .forUser(user)
      .on('update', callState => callState); // do things with callState
  });

  it('should get updated call states for all vehicles and a single user', () => {
    const user = { href: '1/SYNC/users/1' };

    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });
    return api.customer('SYNC')
      .realTime()
      .callStates()
      .forUser(user)
      .on('update', callState => callState); // do things with callState
  });
});
