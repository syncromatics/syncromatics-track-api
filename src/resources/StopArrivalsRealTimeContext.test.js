import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import StopArrivalsRealTimeContext from './StopArrivalsRealTimeContext';
import RealTimeClient from '../RealTimeClient';
import { realTime as mock } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When creating a subscription for stop arrivals', () => {
  const entity = 'STOP_ARRIVALS';
  const customerCode = 'SYNC';

  let server;
  let realTimeClient;
  let subject;

  beforeEach(() => {
    server = mock.getServer();
    realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    subject = new StopArrivalsRealTimeContext(realTimeClient, customerCode);
  });

  it('can add filters for a single stop', () => {
    const stopHref = '/1/SYNC/stops/1';
    const expectedFilters = { stops: [stopHref] };
    subject.forStop(stopHref).on('update', () => { });

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('can add filters for multiple stops', () => {
    const stopHrefs = ['/1/SYNC/stops/1', '/1/SYNC/stops/2'];
    const expectedFilters = { stops: stopHrefs };
    subject.forStops(stopHrefs).on('update', () => { });

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('should handle entity updates', () => {
    let resolver;
    const updateReceived = new Promise((resolve) => { resolver = resolve; });
    const connectionClosed = updateReceived
      .then(() => server.closeConnection(realTimeClient));

    const stopHref = '/1/SYNC/stops/1';
    const subscription = subject
      .forStop(stopHref)
      .on('update', resolver);

    return Promise.all([
      subscription,
      updateReceived,
      connectionClosed,
    ]);
  });
});
