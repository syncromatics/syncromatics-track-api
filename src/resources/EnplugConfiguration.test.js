import chai from 'chai';
import fetchMock from 'fetch-mock';

import chaiAsPromised from 'chai-as-promised';
import Client from '../Client';
import EnplugConfiguration from './EnplugConfiguration';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating an enplug configuration based on customer and enplug serial', () => {
  const client = new Client();
  const enplugConfiguration = new EnplugConfiguration(client, EnplugConfiguration.makeHref('SYNC', 'SERIAL#11'));

  it('should set the href', () => enplugConfiguration.href.should.equal('/1/SYNC/enplugs/SERIAL#11/configuration'));
  it('should not be hydrated', () => enplugConfiguration.hydrated.should.equal(false));
});

describe('When instantiating a vehicle media based on an object', () => {
  const client = new Client();
  const mockConfiguration = new EnplugConfiguration(client, { deviceSerial: 'LLCM2', volume: 28, shouldSwitch: true, vehicleHref: '/1/SYNC/vehicles/1234' });
  const enplugConfiguration = new EnplugConfiguration(client, mockConfiguration);

  it('should set the volume', () => enplugConfiguration.volume.should.equal(28));
  it('should set the deviceSerial', () => enplugConfiguration.deviceSerial.should.equal('LLCM2'));
  it('should set the vehicleHref', () => enplugConfiguration.vehicleHref.should.equal('/1/SYNC/vehicles/1234'));
  it('should set the shouldSwitch', () => enplugConfiguration.shouldSwitch.should.equal(true));
});

describe('When updating enplug configuration', () => {
  const client = new Client();
  const mockConfiguration = new EnplugConfiguration(client, { deviceSerial: 'LLCM2', volume: 28, shouldSwitch: true, vehicleHref: '/1/SYNC/vehicles/1234' });

  const singleResponse = () => new Response(mockConfiguration);
  beforeEach(() => {
    fetchMock.put(client.resolve('/1/SYNC/enplugs/LLCM2/configuration'), singleResponse);
  });

  let promise;
  beforeEach(() => {
    promise = new EnplugConfiguration(client, mockConfiguration).update();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the volume', () => promise.then(v => v.volume).should.eventually.equal(28));
  it('should set the deviceSerial', () => promise.then(v => v.deviceSerial).should.eventually.equal('LLCM2'));
});
