import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, realTime as realTimeMocks } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When subscribing to stop times', () => {
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

  it('should get updated stop times for a single vehicle', () => {
    const vehicleHref = '1/SYNC/vehicles/123';

    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });
    return api.customer('SYNC')
      .realTime()
      .stopTimes()
      .forVehicle(vehicleHref)
      .on('update', stopTimes => stopTimes); // do things with stop times
  });

  it('should get updated stop times for multiple vehicles', () => {
    const vehicles = [
      { href: '1/SYNC/vehicles/123' },
      { href: '1/SYNC/vehicles/456' },
      { href: '1/SYNC/vehicles/789' },
    ];


    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });
    return api.customer('SYNC')
      .realTime()
      .stopTimes()
      .forVehicles(vehicles)
      .on('update', stopTimes => stopTimes); // do things with stop times
  });

  it('should only get stop times that are for both a single vehicle and a list of stops', () => {
    const vehicle = '1/SYNC/vehicles/123';
    const stops = [
      '1/SYNC/stops/123',
      '1/SYNC/stops/456',
      '1/SYNC/stops/789',
    ];

    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });
    return api.customer('SYNC')
      .realTime()
      .stopTimes()
      .forVehicle(vehicle)
      .forStops(stops)
      .on('update', stopTimes => stopTimes); // do things with stop times
  });
});
