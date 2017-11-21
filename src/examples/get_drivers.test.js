import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, drivers as mockDrivers } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When searching for drivers by name', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockDrivers.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a list of drivers', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const driversPromise = api.customer('SYNC').drivers()
      .withQuery('charlie') // drivers containing 'charlie' in their name
      .getPage()
      .then(page => page.list)
      .then(drivers => drivers); // Do things with list of drivers

    return driversPromise;
  });
});

describe('When retrieving a driver by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockDrivers.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a driver', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const driverPromise = api.customer('SYNC').driver(1)
      .fetch()
      .then(driver => driver); // Do things with driver

    return driverPromise;
  });
});
