import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import Vehicle from './Vehicle';
import Assignment from './Assignment';
import { vehicles as mockVehicles } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a vehicle based on customer and ID', () => {
  const client = new Client();
  const vehicle = new Vehicle(client, Vehicle.makeHref('SYNC', 1));

  it('should set the href', () => vehicle.href.should.equal('/1/SYNC/vehicles/1'));
  it('should not be hydrated', () => vehicle.hydrated.should.equal(false));
});

describe('When instantiating a vehicle based on an object', () => {
  const client = new Client();
  const vehicle = new Vehicle(client, mockVehicles.getById(1));

  it('should set the ID', () => vehicle.id.should.equal(1));
  it('should set the href', () => vehicle.href.should.equal('/1/SYNC/vehicles/1'));
  it('should be hydrated', () => vehicle.hydrated.should.equal(true));
  it('should have an assignment', () => vehicle.assignment.should.be.an.instanceof(Assignment));
});

describe('When fetching a vehicle based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mockVehicles.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Vehicle(client, Vehicle.makeHref('SYNC', 1)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(v => v.id).should.eventually.equal(1));
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/vehicles/1'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
  it('should have an assignment', () => promise.then(v => v.assignment).should.eventually.be.an.instanceof(Assignment));
  it('should have media associated', () => promise.then(v => v.media).should.eventually.be.not.empty);
});

describe('When fetching a vehicle related to an assignment', () => {
  const client = new Client();

  beforeEach(() => mockVehicles.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const mockAssignment = mockVehicles.getById(1).assignment;
    const assignment = new Assignment(client, mockAssignment);
    promise = assignment.vehicle.fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(v => v.id).should.eventually.equal(1));
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/vehicles/1'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
  it('should have an assignment', () => promise.then(v => v.assignment).should.eventually.be.an.instanceof(Assignment));
});
