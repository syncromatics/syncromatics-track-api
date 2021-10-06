import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import VoipHeartbeatHandler from './VoipHeartbeatHandler';
import RealTimeClient from '../RealTimeClient';
import { realTime as mock } from '../mocks';
import * as messages from '../subscriptions/messages';

chai.should();
chai.use(chaiAsPromised);

const customerCode = 'SYNC';

describe('When sending and receiving heartbeats', () => {
  let server;
  let realTimeClient;
  let subject;

  beforeEach(() => {
    server = mock.getServer();
    realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    subject = new VoipHeartbeatHandler(realTimeClient, customerCode, {
      heartbeatIntervalMs: 100,
      heartbeatReadTimeoutMs: 100,
    });
  });

  afterEach(() => {
    subject.stopHeartbeat();
    server.closeConnection();
  });

  const sendServerHeartbeat = () => server.emit('message', JSON.stringify({
    type: messages.HEARTBEAT,
    at_time: new Date().toISOString(),
    desired_call_state: 'OnCall',
    desired_call_href: '/1/SYNC/calls/123',
  }));

  it('should send heartbeats periodically', () => {
    let resolver;
    const promise = new Promise((x) => { resolver = x; });

    let receivedHeartbeats = 0;

    server.onTrackMessage(messages.HEARTBEAT, () => {
      receivedHeartbeats += 1;
      if (receivedHeartbeats === 2) resolver();
    });

    subject.startHeartbeat();

    return promise.should.eventually.be.fulfilled;
  });

  it('should send current call state along the heartbeat', () => {
    let receivedResolver;
    const received = new Promise((resolver) => { receivedResolver = resolver; });
    subject.startHeartbeat();

    const expectedCallState = 'OnCall';
    const expectedCallHref = '/1/SYNC/calls/123';
    subject.setCallState(expectedCallState, expectedCallHref);

    server.onTrackMessage(messages.HEARTBEAT, (heartbeat) => {
      const {
        current_call_state: callState,
        current_call_href: callHref,
      } = heartbeat;
      if (callState === expectedCallState && callHref === expectedCallHref) {
        receivedResolver(heartbeat);
      }
    });

    return received.should.eventually.be.fulfilled;
  });

  it('should run the onDisconnect handler', () => {
    let onDisconnectResolver;
    const onDisconnectPromise = new Promise((resolver) => { onDisconnectResolver = resolver; });

    subject
      .onDisconnect(onDisconnectResolver)
      .startHeartbeat();

    // sending this once starts the countdown timer...
    sendServerHeartbeat();

    return onDisconnectPromise.should.be.fulfilled;
  });

  it('should run the call state change handler', () => {
    let stateChangeResolver;
    const stateChangePromise = new Promise((resolver) => { stateChangeResolver = resolver; });

    subject
      .onDesiredCallStateChange((callState, callHref, isMuted) => {
        stateChangeResolver({
          callState,
          callHref,
          isMuted,
        });
      })
      .startHeartbeat();

    sendServerHeartbeat();

    return stateChangePromise.should.be.fulfilled;
  });
});
