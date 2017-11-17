import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, realTime as realTimeMocks } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When subscribing to vehicles', () => {
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

  it('should get updated vehicles for a single vehicle', () => {
    const vehicleHref = '1/SYNC/vehicles/123';

    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });
    return api.customer('SYNC')
      .realTime()
      .vehicles()
      .forVehicle(vehicleHref)
      .on('update', response => response.data); // do things with vehicles
  });

  it('should get updated vehicles for multiple vehicles', () => {
    const vehicles = [
      { href: '1/SYNC/vehicles/123' },
      { href: '1/SYNC/vehicles/456' },
      { href: '1/SYNC/vehicles/789' },
    ];

    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });
    return api.customer('SYNC')
      .realTime()
      .vehicles()
      .forVehicles(vehicles)
      .on('update', response => response.data); // do things with vehicles
  });
});
