import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import DispatchMessagesRealTimeContext from './DispatchMessagesRealTimeContext';
import RealTimeClient from '../RealTimeClient';
import { realTime as mock } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When creating a subscription for Dispatch Messages', () => {
  const entity = 'DISPATCH_MESSAGES';
  const customerCode = 'SYNC';

  it('can add filters for a single driver', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new DispatchMessagesRealTimeContext(realTimeClient, customerCode);

    const driverHref = '/1/SYNC/drivers/1';
    const expectedFilters = { drivers: [driverHref] };
    subject.forDriver(driverHref).on('update', () => { });

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('can add filters for multiple drivers', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new DispatchMessagesRealTimeContext(realTimeClient, customerCode);

    const driverHrefs = ['/1/SYNC/drivers/1', '/1/SYNC/drivers/2'];
    const expectedFilters = { drivers: driverHrefs };
    subject.forDrivers(driverHrefs).on('update', () => { });

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('should handle entity updates', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new DispatchMessagesRealTimeContext(realTimeClient, customerCode);

    let resolver;
    const updateReceived = new Promise((resolve) => { resolver = resolve; });
    const connectionClosed = updateReceived
      .then(() => server.closeConnection(realTimeClient));

    const driverHref = '/1/SYNC/drivers/1';
    const subscription = subject
      .forDriver(driverHref)
      .on('update', resolver);

    return Promise.all([
      subscription,
      updateReceived,
      connectionClosed,
    ]);
  });
});
