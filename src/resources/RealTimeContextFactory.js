import AssignmentsRealTimeContext from './AssignmentsRealTimeContext';
import StopTimesRealTimeContext from './StopTimesRealTimeContext';
import VehiclesRealTimeContext from './VehiclesRealTimeContext';

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
   * Creates a RealTimeContext for querying Assignment updates.
   * @returns {AssignmentsRealTimeContext} The newly created context.
   */
  assignments() {
    return new AssignmentsRealTimeContext(this.realTimeClient, this.customerCode);
  }

  /**
   * Creates a RealTimeContext for querying Stop Time updates.
   * @returns {StopTimesRealTimeContext} The newly created context.
   */
  stopTimes() {
    return new StopTimesRealTimeContext(this.realTimeClient, this.customerCode);
  }

  /**
   * Creates a RealTimeContext for querying Vehicle updates.
   * @returns {VehiclesRealTimeContext} The newly created context.
   */
  vehicles() {
    return new VehiclesRealTimeContext(this.realTimeClient, this.customerCode);
  }
}

export default RealTimeContextFactory;
