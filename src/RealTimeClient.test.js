import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import RealTimeClient from './RealTimeClient';
import { realTime as mock } from './mocks';
import * as messages from './subscriptions/messages';

chai.should();
chai.use(chaiAsPromised);


describe('When creating a real time connection', () => {
  let server;
  beforeEach(() => { server = mock.getServer(); });
  afterEach(() => server.closeConnection());

  it('should connect only after REST client authenticates', () => {
    let resolveAuthentication;
    const mockClient = {
      authenticated: new Promise((resolve) => { resolveAuthentication = resolve; }),
    };
    let wasConnectionOpened = false;
    server.on('connection', () => {
      wasConnectionOpened = true;
    });
    const realTimeClient = new RealTimeClient(mockClient, mock.options);

    const messagePromise = realTimeClient.sendMessage({ foo: 'bar' });
    wasConnectionOpened.should.equal(false);

    resolveAuthentication();
    return Promise.all([
      mockClient.authenticated,
      messagePromise,
    ])
    .then(() => server.closeConnection(realTimeClient))
    .then(() => wasConnectionOpened).should.eventually.become(true);
  });

  it('should create at most one connection', () => {
    let numConnections = 0;
    server.on('connection', () => {
      numConnections += 1;
    });
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);

    const message1 = realTimeClient.sendMessage({ foo: 'bar' });
    const message2 = realTimeClient.sendMessage({ bar: 'baz' });
    const message3 = realTimeClient.sendMessage({ baz: 'foo' });
    return Promise.all([
      message1,
      message2,
      message3,
    ])
    .then(() => server.closeConnection(realTimeClient))
    .then(() => numConnections).should.eventually.become(1);
  });

  it('should queue messages to send while connecting', () => {
    let resolveAuthentication;
    let resolveGotAllMessages;
    const mockClient = {
      authenticated: new Promise((resolve) => { resolveAuthentication = resolve; }),
    };
    let numMessagesReceived = 0;

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
    const realTimeClient = new RealTimeClient(mockClient, mock.options);

    const message1 = realTimeClient.sendMessage({ foo: 'bar' });
    const message2 = realTimeClient.sendMessage({ bar: 'baz' });
    const message3 = realTimeClient.sendMessage({ baz: 'foo' });

    resolveAuthentication();

    return Promise.all([
      message1,
      message2,
      message3,
      gotAllMessages,
    ])
      .then(() => server.closeConnection(realTimeClient));
  });
});

describe('When the real time connection is disconnected', () => {
  let server;
  let realTimeClient;
  beforeEach(() => {
    server = mock.getServer();
    realTimeClient = new RealTimeClient(mock.authenticatedClient, {
      ...mock.options,
      reconnectTimeout: 0,
    });
  });
  afterEach(() => {
    server.closeConnection(realTimeClient);
  });

  const reconnect = () => {
    server.closeConnection();
    server = mock.getServer();
    return Promise.resolve();
  };

  it('should reconnect and re-authenticate', () => {
    let numAuths = 0;
    let resolveGotAllAuths;
    const gotAllAuths = new Promise((resolve) => { resolveGotAllAuths = resolve; });
    let numMessages = 0;
    let resolveGotAllMessages;
    const gotAllMessages = new Promise((resolve) => {
      resolveGotAllMessages = resolve;
    });
    const configureListener = () => {
      server.onTrackMessage(messages.AUTHENTICATION.REQUEST, () => {
        numAuths += 1;
        if (numAuths === 2) {
          resolveGotAllAuths();
        }
      });
      server.onTrackMessage('TEST', () => {
        numMessages += 1;
        if (numMessages === 2) {
          resolveGotAllMessages();
        }
      });
    };

    configureListener();
    const message1 = realTimeClient.sendMessage({ type: 'TEST', id: 1 })
      .then(reconnect)
      .then(configureListener);
    const message2 = message1
      .then(() => realTimeClient.sendMessage({ type: 'TEST', id: 2 }));
    return Promise.all([
      message1,
      message2,
      gotAllAuths,
      gotAllMessages,
    ]);
  });

  it('should resubscribe to all subscriptions', () => {
    let startRequests = 0;
    let gotAllStartRequestsResolver;
    const gotAllStartRequests = new Promise((resolve) => {
      gotAllStartRequestsResolver = resolve;
    });
    let lastSubscriptionResolver;
    const lastSubscription = new Promise((resolve) => {
      lastSubscriptionResolver = resolve;
    });
    const configureListener = () => {
      server.onTrackMessage(messages.SUBSCRIPTION_START.REQUEST, () => {
        startRequests += 1;
        if (startRequests === 2) {
          gotAllStartRequestsResolver();
        }
      });
      server.onTrackMessage(messages.SUBSCRIPTION_END.REQUEST, (message) => {
        lastSubscriptionResolver(message.subscription_id);
      });
    };
    configureListener();
    const observedSubscriptionIds = [];
    const subscriptionStart = realTimeClient.startSubscription(
      'VEHICLES',
      'SYNC',
      {
        one: '1',
        two: '2',
        three: '3',
      },
      (update) => { observedSubscriptionIds.push(update.subscription_id); },
    );

    let subscriptionEnder;
    const disruptConnection = subscriptionStart
      .then((end) => {
        subscriptionEnder = end;
      })
      .then(reconnect)
      .then(configureListener);
    const endSubscription = gotAllStartRequests
      .then(() => subscriptionEnder());
    const multipleSubscriptions = endSubscription
      .then(() => observedSubscriptionIds);
    return Promise.all([
      subscriptionStart,
      disruptConnection,
      endSubscription,
      gotAllStartRequests,
      multipleSubscriptions.should.eventually.become([1, 2]),
      lastSubscription.should.eventually.become(2),
    ]);
  });

  it('should fire disconnect and reconnect event handlers', () => {
    let resolveDisconnectEvent;
    const disconnectEvent = new Promise((resolve) => { resolveDisconnectEvent = resolve; });
    let resolveReconnectEvent;
    const reconnectEvent = new Promise((resolve) => { resolveReconnectEvent = resolve; });

    realTimeClient.addEventListener('disconnect', resolveDisconnectEvent);
    realTimeClient.addEventListener('reconnect', resolveReconnectEvent);

    const startAndRestart = realTimeClient.sendMessage({ type: 'TEST', id: 1 })
      .then(reconnect);

    return Promise.all([
      startAndRestart,
      disconnectEvent,
      reconnectEvent,
    ]);
  });
});
