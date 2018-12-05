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

describe('When retrieving a vehicle assignment by vehicle ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockVehicles.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get an assignment', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const assignmentPromise = api.customer('SYNC').assignment(1)
      .fetch()
      .then(assignment => assignment); // Do things with assignment

    return assignmentPromise;
  });
});

describe('When assigning a vehicle', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockVehicles.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should create an assignment', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const customer = api.customer('SYNC');
    const assignment = customer.assignment(1);
    assignment.driver = customer.driver(1);
    assignment.pattern = customer.pattern(1);
    assignment.run = customer.run(1);
    assignment.trip = customer.trip(1);

    const assignmentPromise = assignment.update()
      .then(() => { /* Do something now that the assignment creation has been requested */ });

    return assignmentPromise;
  });

  it('should remove an assignment', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const customer = api.customer('SYNC');
    const assignmentPromise = customer.assignment(1).fetch()
      .then(assignment => assignment.delete())
      .then(() => { /* Do something now that the assignment deletion has been requested */ });

    return assignmentPromise;
  });
});

describe('When retrieving vehicle media by vehicle', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockVehicles.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a vehicle', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const vehicleMediaPromise = api.customer('SYNC').vehicle(1)
      .fetch()
      .then(vehicle => vehicle.media
        .find(media => media.name === '1')
        .fetch()) // Choose vehicle media
      .then(media => media.data); // Do something with Blob

    return vehicleMediaPromise;
  });
});
