import AreasRealTimeContext from './AreasRealTimeContext';
import AssignmentsRealTimeContext from './AssignmentsRealTimeContext';
import CallStatesRealTimeContext from './CallStatesRealTimeContext';
import DispatchMessagesRealTimeContext from './DispatchMessagesRealTimeContext';
import SignsRealTimeContext from './SignsRealTimeContext';
import StopsRealTimeContext from './StopsRealTimeContext';
import StopArrivalsRealTimeContext from './StopArrivalsRealTimeContext';
import StopTimesRealTimeContext from './StopTimesRealTimeContext';
import VehicleArrivalsRealTimeContext from './VehicleArrivalsRealTimeContext';
import EnplugDetailsRealTimeContext from './EnplugDetailsRealTimeContext';
import EnplugHealthsRealTimeContext from './EnplugHealthsRealTimeContext';
import IncidentsRealTimeContext from './IncidentsRealTimeContext';
import VehiclesRealTimeContext from './VehiclesRealTimeContext';
import VoipHeartbeatHandler from './VoipHeartbeatHandler';

/**
 * A factory for creating entity-specific Real Time Contexts for a given Real Time Client.
 * An implementation detail for providing .realTime() to the Customer resource without creating
 * circular module imports.
 */
class RealTimeContextFactory {
  /**
   * Creates a new RealTimeContextFactory that can be used to create entity-specific
   * RealTimeContexts.
   * @param {RealTimeClient} realTimeClient A pre-configured instance of RealTimeClient.
   * @param {string} customerCode The customer code for this real-time context.
   */
  constructor(realTimeClient, customerCode) {
    if (!realTimeClient) {
      throw new Error('Argument realTimeClient is missing');
    }
    if (!customerCode) {
      throw new Error('Argument customerCode is missing');
    }
    this.realTimeClient = realTimeClient;
    this.customerCode = customerCode;
  }

  /**
   * Attaches a global event handler to be fired when the real time client disconnects unexpectedly.
   * @param {function} handler The handler to be fired.
   * @returns {function} A function that, when called, will remove the event handler.
   */
  onDisconnect(handler) {
    if (typeof handler !== 'function') {
      throw new Error('handler must be a function.');
    }
    this.realTimeClient.addEventListener('disconnect', handler);
    return () => this.realTimeClient.removeEventListener('disconnect', handler);
  }

  /**
   * Attaches a global event handler to be fired when the real time client reconnects after an
   * unexpected disconnection.
   * @param {function} handler The handler to be fired.
   * @returns {function} A function that, when called, will remove the event handler.
   */
  onReconnect(handler) {
    if (typeof handler !== 'function') {
      throw new Error('handler must be a function.');
    }
    this.realTimeClient.addEventListener('reconnect', handler);
    return () => this.realTimeClient.removeEventListener('reconnect', handler);
  }

  /**
   * Creates a RealTimeContext for querying Area updates.
   * @returns {AreasRealTimeContext} The newly created context.
   */
  areas() {
    return new AreasRealTimeContext(this.realTimeClient, this.customerCode);
  }

  /**
   * Creates a RealTimeContext for querying Assignment updates.
   * @returns {AssignmentsRealTimeContext} The newly created context.
   */
  assignments() {
    return new AssignmentsRealTimeContext(this.realTimeClient, this.customerCode);
  }

  /**
   * Creates a RealTimeContext for querying Call State updates.
   * @returns {CallStatesRealTimeContext} The newly created context.
   */
  callStates() {
    return new CallStatesRealTimeContext(this.realTimeClient, this.customerCode);
  }

  /**
   * Creates a RealTimeContext for querying Dispatch Messages updates.
   * @returns {DispatchMessagesRealTimeContext} The newly created context.
   */
  dispatchMessages() {
    return new DispatchMessagesRealTimeContext(this.realTimeClient, this.customerCode);
  }

  /**
   * Creates a RealTimeContext for querying Enplug Details updates.
   * @returns {EnplugDetailsRealTimeContext} The newly created context.
   */
  enplugDetails() {
    return new EnplugDetailsRealTimeContext(this.realTimeClient, this.customerCode);
  }

  /**
   * Creates a RealTimeContext for querying Enplug Healths updates.
   * @returns {EnplugHealthsRealTimeContext} The newly created context.
   */
  enplugHealths() {
    return new EnplugHealthsRealTimeContext(this.realTimeClient, this.customerCode);
  }

  /**
   * Creates a RealTimeContext for querying Incident updates.
   * @returns {IncidentsRealTimeContext} The newly created context.
   */
  incidents() {
    return new IncidentsRealTimeContext(this.realTimeClient, this.customerCode);
  }

  /**
   * Creates a RealTimeContext for querying Signs updates.
   * @returns {SignsRealTimeContext} The newly created context.
   */
  signs() {
    return new SignsRealTimeContext(this.realTimeClient, this.customerCode);
  }

  /**
   * Creates a RealTimeContext for querying Stop Arrivals updates.
   * @returns {StopArrivalsRealTimeContext} The newly created context.
   */
  stopArrivals() {
    return new StopArrivalsRealTimeContext(this.realTimeClient, this.customerCode);
  }

  /**
   * Creates a RealTimeContext for querying Stop updates.
   * @returns {StopsRealTimeContext} The newly created context.
   */
  stops() {
    return new StopsRealTimeContext(this.realTimeClient, this.customerCode);
  }

  /**
   * Creates a RealTimeContext for querying Stop Time updates.
   * @returns {StopTimesRealTimeContext} The newly created context.
   */
  stopTimes() {
    return new StopTimesRealTimeContext(this.realTimeClient, this.customerCode);
  }

  /**
   * Creates a RealTimeContext for querying Vehicle Arrivals updates.
   * @returns {VehicleArrivalsRealTimeContext} The newly created context.
   */
  vehicleArrivals() {
    return new VehicleArrivalsRealTimeContext(this.realTimeClient, this.customerCode);
  }

  /**
   * Creates a RealTimeContext for querying Vehicle updates.
   * @returns {VehiclesRealTimeContext} The newly created context.
   */
  vehicles() {
    return new VehiclesRealTimeContext(this.realTimeClient, this.customerCode);
  }

  /**
   * Creates a VoipHeartbeatHandler for sending current VOIP call state and receiving
   * desired VOIP call state over heartbeats.
   * @param {Object} options Options for the handler
   * @returns {VoipHeartbeatHandler} The newly created handler.
   */
  voip(options) {
    return new VoipHeartbeatHandler(this.realTimeClient, this.customerCode, options);
  }
}

export default RealTimeContextFactory;