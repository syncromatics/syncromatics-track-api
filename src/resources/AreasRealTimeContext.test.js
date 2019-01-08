import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import AreasRealTimeContext from './AreasRealTimeContext';
import RealTimeClient from '../RealTimeClient';
import { realTime as mock } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When creating a subscription for Areas', () => {
  const entity = 'AREAS';
  const customerCode = 'SYNC';
  const emptyFilters = {
    areas: [],
  };

  it('can add filters for a single area', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new AreasRealTimeContext(realTimeClient, customerCode);

    const areaHref = '123';
    const expectedFilters = {
      ...emptyFilters,
      areas: [areaHref],
    };
    subject.forArea(areaHref).on('update', () => {});

    const options = {
      closeConnection: true,
      realTimeClient,
    };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('can add filters for an array of areas', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new AreasRealTimeContext(realTimeClient, customerCode);

    const areaHrefs = ['123', '456', '489'];
    const expectedFilters = {
      ...emptyFilters,
      areas: areaHrefs,
    };

    subject.forAreas(areaHrefs).on('update', () => {});

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
    const subject = new AreasRealTimeContext(realTimeClient, customerCode);

    let resolver;
    const updateReceived = new Promise((resolve) => {
      resolver = resolve;
    });

    const subscription = subject
      .forArea('/1/SYNC/areas/1')
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
