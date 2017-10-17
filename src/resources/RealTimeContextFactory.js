import AssignmentsRealTimeContext from './AssignmentsRealTimeContext';
import StopTimesRealTimeContext from './StopTimesRealTimeContext';

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
   */
  constructor(realTimeClient) {
    if (!realTimeClient) {
      throw new Error('Argument realTimeClient is missing');
    }
    this.realTimeClient = realTimeClient;
  }

  /**
   * Creates a RealTimeContext for querying Assignment updates.
   * @returns {AssignmentsRealTimeContext} The newly created context.
   */
  assignments() {
    return new AssignmentsRealTimeContext(this.realTimeClient);
  }

  /**
   * Creates a RealTimeContext for querying Stop Time updates.
   * @returns {StopTimesRealTimeContext} The newly created context.
   */
  stopTimes() {
    return new StopTimesRealTimeContext(this.realTimeClient);
  }
}

export default RealTimeContextFactory;
