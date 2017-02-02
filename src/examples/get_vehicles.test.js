import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, vehicles as mockVehicles } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When searching for vehicles by name', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockVehicles.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a list of vehicles', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const vehiclesPromise = api.customer('SYNC').vehicles()
      .withQuery('12') // Vehicles containing "12" in their name
      .getPage()
      .then(page => page.list)
      .then(vehicles => vehicles); // Do things with list of vehicles

    return vehiclesPromise;
  });
});

describe('When retrieving a vehicle by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockVehicles.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a vehicle', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const vehiclesPromise = api.customer('SYNC').vehicle(1)
      .fetch()
      .then(vehicle => vehicle); // Do things with vehicle

    return vehiclesPromise;
  });
});
