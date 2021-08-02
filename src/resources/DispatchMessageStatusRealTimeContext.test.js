import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import DispatchMessageStatusRealTimeContext from './DispatchMessageStatusRealTimeContext';
import RealTimeClient from '../RealTimeClient';
import { realTime as mock } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When creating a subscription for Dispatch Message Status', () => {
  const entity = 'DISPATCH_MESSAGE_STATUSES';
  const customerCode = 'SYNC';

  it('can add filters for a single user', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new DispatchMessageStatusRealTimeContext(realTimeClient, customerCode);

    const userHref = '/1/users/1';
    const expectedFilters = { users: [userHref] };
    subject.forUser(userHref).on('update', () => { });

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('can add filters for multiple users', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new DispatchMessageStatusRealTimeContext(realTimeClient, customerCode);

    const userHrefs = ['/1/users/1', '/1/users/1'];
    const expectedFilters = { users: userHrefs };
    subject.forUsers(userHrefs).on('update', () => { });

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('should handle entity updates', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new DispatchMessageStatusRealTimeContext(realTimeClient, customerCode);

    let resolver;
    const updateReceived = new Promise((resolve) => { resolver = resolve; });
    const connectionClosed = updateReceived
      .then(() => server.closeConnection(realTimeClient));

    const userHref = '/1/users/1';
    const subscription = subject
      .forUser(userHref)
      .on('update', resolver);

    return Promise.all([
      subscription,
      updateReceived,
      connectionClosed,
    ]);
  });
});
