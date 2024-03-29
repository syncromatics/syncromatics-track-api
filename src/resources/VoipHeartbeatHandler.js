import { v4 as uuidv4 } from 'uuid';

const defaultHeartbeatIntervalMs = 15 * 1000;
const defaultHeartbeatReadTimeoutMs = 45 * 1000;

const validCallStates = {
  None: 'None',
  OnCall: 'OnCall',
};

const isValidCallState = (callState, callHref) => {
  if (!Object.keys(validCallStates).includes(callState)) {
    return false;
  }

  return callState === validCallStates.None || (typeof callHref === 'string' && callHref !== '');
};

const getHeartbeat = (voipHeartbeatHandler) => {
  const now = new Date().toISOString();
  const { customerCode, sessionId, participantType, callState, callHref } = voipHeartbeatHandler;
  return {
    type: 'HEARTBEAT',
    at_time: now,
    session_id: sessionId,
    participant_type: participantType,
    customer: customerCode,
    current_call_state: callState,
    current_call_href: callHref,
  };
};

/**
 * Handler for VOIP call state and receiving desired VOIP call state over heartbeats.
 */
class VoipHeartbeatHandler {
  /**
   * Creates a VoipHeartbeatHandler for sending current VOIP call state and receiving
   * desired VOIP call state over heartbeats.
   * @param {RealTimeClient} realTimeClient A pre-configured instance of RealTimeClient.
   * @param {string} customerCode The customer code for this real-time context.
   * @param {Object} options Options for the handler
   * @param {number} [options.heartbeatIntervalMs] The minimum interval to send heartbeats to
   * Track API
   * @param {number} [options.heartbeatReadTimeoutMs] The time to wait for receiving a heartbeat
   * from Track API
   * @param {string} [options.participantType] Indication of the type of participant that is
   * reporting a heartbeat. Valid values are "User" (default) and "Supervisor"
   */
  constructor(realTimeClient, customerCode, options = {}) {
    this.realTimeClient = realTimeClient;
    this.customerCode = customerCode;

    // uuidv4 is randomly generated.
    this.sessionId = uuidv4();
    this.participantType = options.participantType || 'User';
    this.callState = validCallStates.None;
    this.callHref = '';
    this.handlers = {};

    this.heartbeatIntervalMs = options.heartbeatIntervalMs || defaultHeartbeatIntervalMs;
    this.heartbeatReadTimeoutMs = options.heartbeatReadTimeoutMs || defaultHeartbeatReadTimeoutMs;

    this.setCallState = this.setCallState.bind(this);
    this.sendHeartbeat = this.sendHeartbeat.bind(this);
    this.readHeartbeat = this.readHeartbeat.bind(this);

    this.onHeartbeatTimeout = this.onHeartbeatTimeout.bind(this);
    this.onDesiredCallStateChange = this.onDesiredCallStateChange.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
    this.onReconnect = this.onReconnect.bind(this);

    this.startHeartbeat = this.startHeartbeat.bind(this);
    this.stopHeartbeat = this.stopHeartbeat.bind(this);

    this.realTimeClient.registerHeartbeatHandler(this.readHeartbeat);
  }

  /**
   * Sets the current actual call state to be sent along with heartbeats.
   * @param {CallState} callState The actual current call state
   * @param {string} callHref The actual current call href, if any
   * @returns {void}
   */
  setCallState(callState, callHref) {
    if (!isValidCallState(callState, callHref)) {
      throw new Error('Invalid call state.');
    }

    const { callState: oldCallState, callHref: oldCallHref } = this;

    this.callState = callState;
    this.callHref = callHref;

    if (oldCallState !== callState || oldCallHref !== callHref) {
      this.sendHeartbeat(this);
    }
  }

  onHeartbeatTimeout() {
    if (!this.running) return;

    const { onDisconnect } = this.handlers;
    if (typeof onDisconnect === 'function') {
      onDisconnect();
    }

    this.realTimeClient.closeConnection({ shouldReconnect: true });
  }

  readHeartbeat(heartbeat) {
    if (!this.running) return;

    const { heartbeatReadTimeoutMs } = this;
    if (this.heartbeatTimeoutInterval) {
      clearTimeout(this.heartbeatTimeoutInterval);
    }
    this.heartbeatTimeoutInterval = setTimeout(this.onHeartbeatTimeout, heartbeatReadTimeoutMs);

    const {
      desired_call_state: desiredCallState,
      desired_call_href: desiredCallHref,
      is_muted: isMuted = false,
    } = heartbeat;
    const { previousDesiredCallState, previousDesiredCallHref, previousIsMuted = false} = this;

    const hasDesiredCallStateChanged =
      desiredCallState !== previousDesiredCallState
      || desiredCallHref !== previousDesiredCallHref
      || isMuted !== previousIsMuted;

    if (hasDesiredCallStateChanged) {
      this.previousDesiredCallState = desiredCallState;
      this.previousDesiredCallHref = desiredCallHref;
      this.previousIsMuted = isMuted;

      const { onDesiredCallStateChange: onChange } = this.handlers;
      if (typeof onChange === 'function') {
        onChange(desiredCallState, desiredCallHref, isMuted);
      }
    }
  }

  sendHeartbeat() {
    if (!this.running) return;

    const self = this;
    const { heartbeatIntervalMs } = self;

    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
    }

    // sendMessage returns a promise that resolves once the message is
    // actually sent.  wait until then until we queue up the next
    // heartbeat.
    const heartbeat = getHeartbeat(self);
    self.realTimeClient.sendMessage(heartbeat).then(() => {
      self.heartbeatTimeout = setTimeout(self.sendHeartbeat, heartbeatIntervalMs);
    });
  }

  /**
   * Registers a handler function to be called when the call state changes.
   * Handler will be called with the desired call state, call href, and
   * whether the connection should be muted.
   * @param {function} handler - function(callState, callHref, isMuted)
   * @returns {VoipHeartbeatHandler} This VoipHeartbeatHandler
   */
  onDesiredCallStateChange(handler) {
    if (typeof handler !== 'function') {
      throw new Error('Must pass a function handler to onDesiredCallStateChange.');
    }
    this.handlers.onDesiredCallStateChange = handler;
    return this;
  }

  /**
   * Set a handler to be run after detecting a disconnect from the server.
   * Overwrites any previously set handler, if any.
   * @param {function} handler The function to run
   * @returns {VoipHeartbeatHandler} returns itself.
   */
  onDisconnect(handler) {
    if (typeof handler !== 'function') {
      throw new Error('Must pass a function handler to onDisconnect.');
    }
    this.handlers.onDisconnect = handler;
    return this;
  }

  /**
   * Set a handler to be run after successfully reconnecting to the server.
   * Overwrites any previously set handler, if any.
   * @param {function} handler The function to run
   * @returns {VoipHeartbeatHandler} returns itself.
   */
  onReconnect(handler) {
    if (typeof handler !== 'function') {
      throw new Error('Must pass a function handler to onReconnect.');
    }
    this.handlers.reconnect = handler;
    return this;
  }

  /**
   * Start sending VoIP heartbeat messages to the Track API server.
   * @returns {VoipHeartbeatHandler} returns itself.
   */
  startHeartbeat() {
    this.running = true;
    this.sendHeartbeat();
    return this;
  }

  /**
   * Stop sending VoIP heartbeat messages to the Track API server.
   * @returns {VoipHeartbeatHandler} returns itself.
   */
  stopHeartbeat() {
    this.running = false;
    if (this.heartbeatTimeoutInterval) {
      clearTimeout(this.heartbeatTimeoutInterval);
    }
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
    }
  }
}

export default VoipHeartbeatHandler;
