import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import RealTimeClient from './RealTimeClient';
import { realTime as mock } from './mocks';
import * as messages from './subscriptions/messages';

chai.should();
chai.use(chaiAsPromised);


describe('When creating a real time connection', () => {
  it('should connect only after REST client authenticates', () => {
    let resolveAuthentication;
    const mockClient = {
      authenticated: new Promise((resolve) => { resolveAuthentication = resolve; }),
    };
    let wasConnectionOpened = false;
    const server = mock.getServer();
    server.on('connection', () => {
      wasConnectionOpened = true;
    });
    const rtClient = new RealTimeClient(mockClient, mock.options);

    const messagePromise = rtClient.sendMessage({ foo: 'bar' });
    wasConnectionOpened.should.equal(false);

    resolveAuthentication();
    return Promise.all([
      mockClient.authenticated,
      messagePromise,
    ])
    .then(() => rtClient.closeConnection())
    .then(() => server.close())
    .then(() => wasConnectionOpened)
    .should.eventually.become(true);
  });

  it('should create at most one connection', () => {
    const server = mock.getServer();
    let numConnections = 0;
    server.on('connection', () => {
      numConnections += 1;
    });
    const rtClient = new RealTimeClient(mock.authenticatedClient, mock.options);

    const message1 = rtClient.sendMessage({ foo: 'bar' });
    const message2 = rtClient.sendMessage({ bar: 'baz' });
    const message3 = rtClient.sendMessage({ baz: 'foo' });
    return Promise.all([
      message1,
      message2,
      message3,
    ])
    .then(() => rtClient.closeConnection())
    .then(() => server.close())
    .then(() => numConnections)
    .should.eventually.become(1);
  });

  it('should queue messages to send while connecting', () => {
    let resolveAuthentication;
    let resolveGotAllMessages;
    const mockClient = {
      authenticated: new Promise((resolve) => { resolveAuthentication = resolve; }),
    };
    let numMessagesReceived = 0;
    const server = mock.getServer();

    // no guarantee on when our webserver mock will fire its message, just that it will.
    // so let's create a promise of it and inspect later.
    // it's safe to wait for this because the test runner will time out if it never resolves.
    const gotAllMessages = new Promise((resolve) => { resolveGotAllMessages = resolve; });
    server.on('message', () => {
      numMessagesReceived += 1;
      // we are sending 3 messages, but there should be also 1 authentication control message.
      if (numMessagesReceived === 4) {
        resolveGotAllMessages();
      }
    });
    const rtClient = new RealTimeClient(mockClient, mock.options);

    const message1 = rtClient.sendMessage({ foo: 'bar' });
    const message2 = rtClient.sendMessage({ bar: 'baz' });
    const message3 = rtClient.sendMessage({ baz: 'foo' });

    resolveAuthentication();

    return Promise.all([
      message1,
      message2,
      message3,
      gotAllMessages,
    ])
    .then(() => rtClient.closeConnection())
    .then(() => server.close())
    .should.be.fulfilled;
  });
});

describe('When the real time connection is disconnected', () => {
  it('should reconnect and re-authenticate', () => {
    const server = mock.getServer();
    let numAuths = 0;
    const rtClient = new RealTimeClient(mock.authenticatedClient, mock.options);

    let resolveGotAllAuths;
    const gotAllAuths = new Promise((resolve) => { resolveGotAllAuths = resolve; });
    server.onTrackMessage(messages.AUTHENTICATION.REQUEST, () => {
      numAuths += 1;
      if (numAuths === 2) {
        resolveGotAllAuths();
      }
    });

    const message1 = rtClient.sendMessage({ foo: 'bar' })
      // force a connection close.  this will trigger another authentication
      // request when it reconnects.
      .then(() => rtClient.connection.close());
    const message2 = rtClient.sendMessage({ bar: 'baz' });
    return Promise.all([
      message1,
      message2,
      gotAllAuths,
    ])
    .then(() => rtClient.closeConnection())
    .then(() => server.close())
    .should.be.fulfilled;
  });
});
