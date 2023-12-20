import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import RealTimeClient from '../RealTimeClient';
import { realTime as mock } from '../mocks';
import TripCancelationsRealTimeContext from "./TripCancelationsRealtimeContext";

chai.should();
chai.use(chaiAsPromised);

describe('When creating a subscription for TripCancelations', () => {
  const entity = 'TRIP_CANCELATIONS';
  const customerCode = 'SYNC';

  it('can add filters for a single customer', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new TripCancelationsRealTimeContext(realTimeClient, customerCode);

    const customerHref = 'SYNC';
    const expectedFilters = { customers: [customerHref] };
    subject.forCustomer(customerHref).on('update', () => {});

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options).should.eventually.become(expectedFilters);
  });
  
  it('should handle entity updates', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new TripCancelationsRealTimeContext(realTimeClient, customerCode);

    let resolver;
    const updateReceived = new Promise((resolve) => {
      resolver = resolve;
    });
    const connectionClosed = updateReceived.then(() => server.closeConnection(realTimeClient));

    const subscription = subject.forCustomer('/1/SYNC').on('update', resolver);

    return Promise.all([subscription, updateReceived, connectionClosed]);
  });
});
