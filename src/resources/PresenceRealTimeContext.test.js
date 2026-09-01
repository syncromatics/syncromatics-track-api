import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import PresenceRealTimeContext from './PresenceRealTimeContext';
import RealTimeClient from '../RealTimeClient';
import * as messages from '../subscriptions/messages';
import { realTime as mock, presence } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When creating a subscription for Presence', () => {
  const entity = 'PRESENCE';
  const customerCode = 'SYNC';

  it('can add filters for a single user', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new PresenceRealTimeContext(realTimeClient, customerCode);

    const userHref = '/1/users/1';
    const expectedFilters = { users: [userHref] };
    subject
      .forUser(userHref)
      .on('update', () => { })
      .start();

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('can add filters for multiple users', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new PresenceRealTimeContext(realTimeClient, customerCode);

    const userHrefs = ['/1/users/1', '/1/users/2'];
    const expectedFilters = { users: userHrefs };
    subject
      .forUsers(userHrefs)
      .on('update', () => { })
      .start();

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('does not start a subscription until start is called', () => {
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new PresenceRealTimeContext(realTimeClient, customerCode);

    const chained = subject
      .on('update', () => { })
      .on('delete', () => { });

    chained.should.equal(subject);
    subject.hasStartedSubscription.should.equal(false);
  });

  it('returns the same promise for repeated calls to start', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new PresenceRealTimeContext(realTimeClient, customerCode);

    subject.on('update', () => { });
    const first = subject.start();
    const second = subject.start();

    second.should.equal(first);

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options);
  });

  it('should handle entity updates and deletes on a single subscription', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new PresenceRealTimeContext(realTimeClient, customerCode);

    let updateResolver;
    const updateReceived = new Promise((resolve) => { updateResolver = resolve; });
    let deleteResolver;
    const deleteReceived = new Promise((resolve) => { deleteResolver = resolve; });

    const subscription = subject
      .on('update', (message) => {
        updateResolver(message);

        // The user in the snapshot goes offline.
        server.emit('message', JSON.stringify({
          type: messages.ENTITY.DELETE,
          subscription_id: message.subscription_id,
          hrefs: ['/1/users/1'],
        }));
      })
      .on('delete', deleteResolver)
      .start();

    const connectionClosed = Promise.all([updateReceived, deleteReceived])
      .then(() => server.closeConnection(realTimeClient));

    return Promise.all([
      subscription,
      updateReceived.then((message) => {
        message.data.should.deep.equal(presence.list);
      }),
      deleteReceived.then((message) => {
        message.hrefs.should.deep.equal(['/1/users/1']);
      }),
      connectionClosed,
    ]);
  });
});
