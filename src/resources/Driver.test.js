import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import Driver from './Driver';
import { drivers as mockDrivers } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a driver based on customer and ID', () => {
  const client = new Client();
  const driver = new Driver(client, Driver.makeHref('SYNC', 1));

  it('should set the href', () => driver.href.should.equal('/1/SYNC/drivers/1'));
  it('should not be hydrated', () => driver.hydrated.should.equal(false));
});

describe('When instantiating a driver based on an object', () => {
  const client = new Client();
  const driver = new Driver(client, mockDrivers.getById(1));

  it('should set the ID', () => driver.id.should.equal(1));
  it('should set the href', () => driver.href.should.equal('/1/SYNC/drivers/1'));
  it('should be hydrated', () => driver.hydrated.should.equal(true));
  it('should have the expected customer driver id', () =>
    driver.customer_driver_id.should.equal('0001'));
  it('should have the expected first name', () => driver.first_name.should.equal('Charlie'));
  it('should have the expected last name', () => driver.last_name.should.equal('Singh'));
});

describe('When fetching a driver based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mockDrivers.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Driver(client, Driver.makeHref('SYNC', 1)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(p => p.id).should.eventually.equal(1));
  it('should set the href', () => promise.then(p => p.href).should.eventually.equal('/1/SYNC/drivers/1'));
  it('should be hydrated', () => promise.then(p => p.hydrated).should.eventually.equal(true));
  it('should have the expected customer driver id', () => promise.then(p => p.customer_driver_id)
    .should.eventually.equal('0001'));
  it('should have the expected first name', () => promise.then(p => p.first_name).should.eventually.equal('Charlie'));
  it('should have the expected last name', () => promise.then(p => p.last_name).should.eventually.equal('Singh'));
});
