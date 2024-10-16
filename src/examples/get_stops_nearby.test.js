import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, stops as mockStops } from '../mocks';

chai.should();
chai.use(chaiAsPromised);
describe('When retrieving nearby stops', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockStops.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a list of nearby stops', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const latitude = 40.7128;
    const longitude = -74.0060;
    const distanceRadius = 200; // in meters

    const stopsNearbyPromise = api.customer('SYNC').stops()
        .getNearby(latitude, longitude, distanceRadius)
        .then(stops => stops); // Do things with list of stops

    return stopsNearbyPromise;
  });
});