import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import IncidentsRealTimeContext from './IncidentsRealTimeContext';
import RealTimeClient from '../RealTimeClient';
import { realTime as mock } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When creating a subscription for Incidents', () => {
  const entity = 'INCIDENTS';
  const customerCode = 'SYNC';

  it('can add filters for a single vehicle', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new IncidentsRealTimeContext(realTimeClient, customerCode);

    const vehicleHref = '123';
    const expectedFilters = { vehicles: [vehicleHref], users: [] };
    subject.forVehicle(vehicleHref).on('update', () => { });

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('can subscribe without filters', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new IncidentsRealTimeContext(realTimeClient, customerCode);

    const expectedFilters = { users: [], vehicles: [] };
    subject.on('update', () => { });

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('can add filters for multiple vehicles', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new IncidentsRealTimeContext(realTimeClient, customerCode);

    const vehicleHrefs = ['123', '456', '489'];
    const expectedFilters = { vehicles: vehicleHrefs, users: [] };

    subject.forVehicles(vehicleHrefs).on('update', () => { });

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('should handle entity updates', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new IncidentsRealTimeContext(realTimeClient, customerCode);

    let resolver;
    const updateReceived = new Promise((resolve) => {
      resolver = resolve;
    });
    const connectionClosed = updateReceived
      .then(() => server.closeConnection(realTimeClient));

    const subscription = subject
      .forVehicle('/1/SYNC/vehicles/1')
      .on('update', resolver);

    return Promise.all([
      subscription,
      updateReceived,
      connectionClosed,
    ]);
  });
});
