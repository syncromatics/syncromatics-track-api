import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import StopsRealTimeContext from './StopsRealTimeContext';
import RealTimeClient from '../RealTimeClient';
import { realTime as mock } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When creating a subscription for Stops', () => {
  const entity = 'STOPS';
  const customerCode = 'SYNC';

  it('can add filters for a single stop', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new StopsRealTimeContext(realTimeClient, customerCode);

    const stopHref = '123';
    const expectedFilters = { stops: [stopHref] };
    subject.forStop(stopHref).on('update', () => { });

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('can add filters for multiple stops', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new StopsRealTimeContext(realTimeClient, customerCode);

    const stopHrefs = ['123', '456', '489'];
    const expectedFilters = { stops: stopHrefs };

    subject.forStops(stopHrefs).on('update', () => { });

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('should handle entity updates', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new StopsRealTimeContext(realTimeClient, customerCode);

    let resolver;
    const updateReceived = new Promise((resolve) => {
      resolver = resolve;
    });
    const connectionClosed = updateReceived
      .then(() => server.closeConnection(realTimeClient));

    const subscription = subject
      .forStop('/1/SYNC/stops/1')
      .on('update', resolver);

    return Promise.all([
      subscription,
      updateReceived,
      connectionClosed,
    ]);
  });
});
