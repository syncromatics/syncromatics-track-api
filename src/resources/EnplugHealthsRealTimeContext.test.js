import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import EnplugHealthsRealTimeContext from './EnplugHealthsRealTimeContext';
import RealTimeClient from '../RealTimeClient';
import { realTime as mock } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When creating a subscription for enplug healths', () => {
  const entity = 'ENPLUG_HEALTHS';
  const customerCode = 'SYNC';

  let server;
  let realTimeClient;
  let subject;

  beforeEach(() => {
    server = mock.getServer();
    realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    subject = new EnplugHealthsRealTimeContext(realTimeClient, customerCode);
  });

  it('can add filters for a single vehicle', () => {
    const vehicleHref = '/1/SYNC/vehicles/1';
    const expectedFilters = { vehicles: [vehicleHref] };
    subject.forVehicle(vehicleHref).on('update', () => { });

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('can add filters for multiple vehicles', () => {
    const vehicleHrefs = ['/1/SYNC/vehicles/1', '/1/SYNC/vehicles/2'];
    const expectedFilters = { vehicles: vehicleHrefs };
    subject.forVehicles(vehicleHrefs).on('update', () => { });

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('should handle entity updates', () => {
    let resolver;
    const updateReceived = new Promise((resolve) => { resolver = resolve; });
    const connectionClosed = updateReceived
      .then(() => server.closeConnection(realTimeClient));

    const vehicleHref = '/1/SYNC/vehicles/1';
    const subscription = subject
      .forVehicle(vehicleHref)
      .on('update', resolver);

    return Promise.all([
      subscription,
      updateReceived,
      connectionClosed,
    ]);
  });
});
