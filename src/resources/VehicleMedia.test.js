import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import VehicleMedia from './VehicleMedia';
import Vehicle from './Vehicle';
import { vehicles as mockVehicles } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a vehicle media based on customer, vehicle ID, and media ID', () => {
  const client = new Client();
  const vehicleMedia = new VehicleMedia(client, VehicleMedia.makeHref('SYNC', 1, 1));

  it('should set the href', () => vehicleMedia.href.should.equal('/1/SYNC/vehicles/1/media/1'));
  it('should not be hydrated', () => vehicleMedia.hydrated.should.equal(false));
});

describe('When instantiating a vehicle media based on an object', () => {
  const client = new Client();
  const vehicleMedia = new VehicleMedia(client, mockVehicles.getById(1).media[0]);

  it('should set the name', () => vehicleMedia.name.should.equal('1'));
  it('should set the content type', () => vehicleMedia.contentType.should.equal('image/jpeg'));
  it('should set the href', () => vehicleMedia.href.should.equal('/1/SYNC/vehicles/1/media/1'));
  it('should be hydrated', () => vehicleMedia.hydrated.should.equal(true));
});

describe('When fetching vehicle media based on customer, vehicle ID, and media ID', () => {
  const client = new Client();

  beforeEach(() => mockVehicles.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new VehicleMedia(client, VehicleMedia.makeHref('SYNC', 1, 1)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the name', () => promise.then(v => v.name).should.eventually.equal('1'));
  it('should set the content type', () => promise.then(v => v.contentType).should.eventually.equal('image/jpeg'));
  it('should set the data', () => promise.then(v => v.data).should.eventually.not.be.empty);
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/vehicles/1/media/1'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});

describe('When fetching media related to a vehicle', () => {
  const client = new Client();

  beforeEach(() => mockVehicles.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const mockVehicle = mockVehicles.getById(1);
    const vehicle = new Vehicle(client, mockVehicle);
    promise = vehicle.media[0].fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the name', () => promise.then(v => v.name).should.eventually.equal('1'));
  it('should set the content type', () => promise.then(v => v.contentType).should.eventually.equal('image/jpeg'));
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/vehicles/1/media/1'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});
