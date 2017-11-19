import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import VehiclesRealTimeContext from './VehiclesRealTimeContext';
import RealTimeClient from '../RealTimeClient';
import { realTime as mock } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When creating a subscription for Vehicles', () => {
  const entity = 'VEHICLES';
  const customerCode = 'SYNC';
  const emptyFilters = {
    vehicles: [],
  };

  it('can add filters for a single vehicle', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new VehiclesRealTimeContext(realTimeClient, customerCode);

    const vehicleHref = '123';
    const expectedFilters = {
      ...emptyFilters,
      vehicles: [vehicleHref],
    };
    subject.forVehicle(vehicleHref).on('update', () => {});

    const options = {
      closeConnection: true,
      realTimeClient,
    };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('can add filters for an array of vehicles', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new VehiclesRealTimeContext(realTimeClient, customerCode);

    const vehicleHrefs = ['123', '456', '489'];
    const expectedFilters = {
      ...emptyFilters,
      vehicles: vehicleHrefs,
    };

    subject.forVehicles(vehicleHrefs).on('update', () => {});

    const options = {
      closeConnection: true,
      realTimeClient,
    };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('should handle entity updates', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new VehiclesRealTimeContext(realTimeClient, customerCode);

    let resolver;
    const updateReceived = new Promise((resolve) => {
      resolver = resolve;
    });

    const subscription = subject
      .forVehicle('/1/SYNC/vehicles/1')
      .on('update', resolver);

    const subscriptionEnd = subscription.then(f => f());

    const connectionClosed = subscriptionEnd
      .then(() => server.closeConnection(realTimeClient));

    return Promise.all([
      subscription,
      updateReceived,
      subscriptionEnd,
      connectionClosed,
    ]);
  });
});
