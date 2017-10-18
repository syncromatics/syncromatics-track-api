/**
 * Base "RealTimeContext"  type for all other real time contexts.
 */
class RealTimeContext {
  /**
   * Creates a real time context that can be used to generate subscriptions.
   * @param {RealTimeClient} realTimeClient Pre-configured instance of RealTimeClient.
   * @param {string} entityName The entity name that Track Real Time API expects for subscriptions
   * to the resource
   */
  constructor(realTimeClient, entityName) {
    if (!realTimeClient) {
      throw new Error('Argument realTimeClient is missing.');
    }
    if (!entityName) {
      throw new Error('Argument entityName is missing.');
    }
    this.realTimeClient = realTimeClient;
    this.entityName = entityName;
    this.hasStartedSubscription = false;
    this.filters = {};

    this.onUpdate = () => {};
    this.onDelete = () => {};
  }

  /**
   * Throws an error if a subscription has already been created for this context.  Otherwise, does
   * nothing.
   * @param {string} attemptedAction A human-readable description of the attempted action
   * @returns {void}
   */
  assertSubscriptionNotStarted(attemptedAction = 'add a filter') {
    if (this.hasStartedSubscription) {
      const error = `You cannot ${attemptedAction} since you have already started a subscription.`;
      throw new Error(error);
    }
  }

  /**
   * Creates a subscription for this real-time context.
   * @param {string} event The event name on which the newly-created subscription should fire.  May
   * be either "update" or "delete".
   * @param {function} handler The handler function to be fired when updates are received for the
   * newly-created subscription.
   * @returns {void} Nothing, but anticipating it will be the newly created subscription.
   */
  on(event, handler) {
    if (typeof handler !== 'function') {
      throw new Error('You must pass a function as handler to on');
    }
    if (event === 'update') {
      this.onUpdate = handler;
    } else if (event === 'delete') {
      this.onDelete = handler;
    } else {
      throw new Error('You must pass either "update" or "delete" as event to on');
    }

    this.hasStartedSubscription = true;
    return this.realTimeClient.startSubscription(
      this.entityName,
      'CODE',
      this.filters,
      this.handleEvent);
  }

  /**
   * Intended to be used for handling subscription events.
   * Will be implemented in an upcoming user story.
   * @returns {void}
   */
  handleEvent() { // eslint-disable-line class-methods-use-this
    throw new Error('Not yet supported.');
  }

  /**
   * Used for consolidating plan href strings and Resources that have hrefs.
   * @param {Resource|string} resource The resource object or href that represents the resource.
   * @returns {string}|The href of the passed-in resource, if any.  Otherwise the string that was
   * passed in.
   */
  static resolveHref(resource) {
    if (typeof resource.href === 'string') {
      return resource.href;
    }
    if (typeof resource === 'string') {
      return resource;
    }
    throw new Error('resolveHref requires you to pass either a string or Resource object.');
  }
}

export default RealTimeContext;
