import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import Vehicle from './Vehicle';
import Assignment from './Assignment';
import { vehicles as mockVehicles } from '../mocks';
import Driver from './Driver';
import Pattern from './Pattern';
import Run from './Run';
import Trip from './Trip';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating an assignment based on customer and ID', () => {
  const client = new Client();
  const assignment = new Assignment(client, Assignment.makeHref('SYNC', 1));

  it('should set the href', () => assignment.href.should.equal('/1/SYNC/vehicles/1/assignment'));
  it('should not be hydrated', () => assignment.hydrated.should.equal(false));
});

describe('When instantiating an assignment based on an object', () => {
  const client = new Client();
  const mockAssignment = mockVehicles.getById(1).assignment;
  const assignment = new Assignment(client, mockAssignment);

  it('should be hydrated', () => assignment.hydrated.should.equal(true));
  it('should have a vehicle', () => assignment.vehicle.should.be.an.instanceof(Vehicle));
  it('should have a driver', () => assignment.driver.should.be.an.instanceof(Driver));
  it('should have a pattern', () => assignment.pattern.should.be.an.instanceof(Pattern));
  it('should have a run', () => assignment.run.should.be.an.instanceof(Run));
  it('should have a trip', () => assignment.trip.should.be.an.instanceof(Trip));
});

describe('When fetching an assignment based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mockVehicles.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Assignment(client, Assignment.makeHref('SYNC', 1)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/vehicles/1/assignment'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
  it('should have a vehicle', () => promise.then(v => v.vehicle).should.eventually.be.an.instanceof(Vehicle));
});

describe('When updating an assignment', () => {
  const client = new Client();

  beforeEach(() => mockVehicles.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Assignment(client, Assignment.makeHref('SYNC', 1))
      .fetch()
      .then((assignment) => {
        // eslint-disable-next-line no-param-reassign
        assignment.driver = new Driver(assignment.client, Driver.makeHref('SYNC', 2));
        return assignment.update();
      })
      .then(assignment => assignment);
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/vehicles/1/assignment'));
  it('should set the driver', () => promise.then(v => v.driver.href).should.eventually.equal('/1/SYNC/drivers/2'));
});

describe('When deleting an assignment', () => {
  const client = new Client();

  beforeEach(() => mockVehicles.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Assignment(client, Assignment.makeHref('SYNC', 1))
      .fetch()
      .then(assignment => assignment.delete());
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
});
