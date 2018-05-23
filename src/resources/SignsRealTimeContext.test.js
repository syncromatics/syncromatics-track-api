import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import SignsRealTimeContext from './SignsRealTimeContext';
import RealTimeClient from '../RealTimeClient';
import { realTime as mock } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When creating a subscription for Signs', () => {
  const entity = 'SIGNS';
  const customerCode = 'SYNC';

  it('can add filters for a single sign', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new SignsRealTimeContext(realTimeClient, customerCode);

    const signHref = '/1/SYNC/signs/1';
    const expectedFilters = { signs: [signHref] };
    subject.forSign(signHref).on('update', () => { });

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('can add filters for multiple signs', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new SignsRealTimeContext(realTimeClient, customerCode);

    const signHrefs = ['/1/SYNC/signs/1', '/1/SYNC/signs/2'];
    const expectedFilters = { signs: signHrefs };
    subject.forSigns(signHrefs).on('update', () => { });

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('should handle entity updates', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new SignsRealTimeContext(realTimeClient, customerCode);

    let resolver;
    const updateReceived = new Promise((resolve) => { resolver = resolve; });
    const connectionClosed = updateReceived
      .then(() => server.closeConnection(realTimeClient));

    const signHref = '/1/SYNC/signs/1';
    const subscription = subject
      .forSign(signHref)
      .on('update', resolver);

    return Promise.all([
      subscription,
      updateReceived,
      connectionClosed,
    ]);
  });
});
