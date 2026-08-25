import RealTimeContext from './RealTimeContext';

/**
 * A real time context that can be used to generate
 * subscriptions to user Presence entities.
 *
 * Unlike other real time contexts, calling on() only registers the handler locally.
 * Call start() once after registering your handlers to create a single PRESENCE
 * subscription that both the update and delete handlers share:
 *
 * @example
 *   const end = await customer.realTime().presence()
 *     .on('update', onUpdate)
 *     .on('delete', onDelete)
 *     .start();
 */
class PresenceRealTimeContext extends RealTimeContext {
  /**
   * Creates a context that can subscribe to Presence updates.
   * @param {RealTimeClient} realTimeClient Pre-configured instance of RealTimeClient.
   * @param {string} customerCode The customer code to query for updates.
   */
  constructor(realTimeClient, customerCode) {
    const entityName = 'PRESENCE';
    super(realTimeClient, entityName, customerCode);
    this.filters = {
      users: [],
    };
    this.subscriptionPromise = null;
  }

  /**
   * Restrict subscriptions created by this context to a single user.
   * Overwrites any existing user filter for this context.
   * Cannot be called after subscription is started.
   * @param {Resource|string} user Href or resource representation of a User
   * @returns {PresenceRealTimeContext} Context with filter applied.
   */
  forUser(user) {
    return this.forUsers([user]);
  }

  /**
   * Restrict subscriptions created by this context to a set of users.
   * Overwrites any existing user filter for this context.
   * Cannot be called after subscription is started.
   * @param {Array.<Resource|string>} users Array of href or resource representations of Users.
   * @returns {PresenceRealTimeContext} Context with filter applied.
   */
  forUsers(users) {
    this.assertSubscriptionNotStarted();
    this.filters.users = users.map(RealTimeContext.resolveHref);
    return this;
  }

  /**
   * Registers a handler for this context without starting a subscription. Returns this context so
   * that handlers can be chained before calling start():
   * .on('update', onUpdate).on('delete', onDelete).start()
   * @param {string} event The event to handle. May be either "update" or "delete".
   * @param {function} handler The handler function to be fired when messages are received for the
   * subscription.
   * @returns {PresenceRealTimeContext} This context, for chaining.
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
    return this;
  }

  /**
   * Starts exactly one PRESENCE subscription. Both the update and delete handlers registered via
   * on() share it. Subsequent calls return the same promise as the first call.
   * @returns {Promise} A promise that resolves when the subscription has started. The value of
   * the resolved promise is a function that, when called, will end the subscription.
   */
  start() {
    if (this.subscriptionPromise) {
      return this.subscriptionPromise;
    }

    this.hasStartedSubscription = true;
    this.subscriptionPromise = this.realTimeClient.startSubscription(
      this.entityName,
      this.customerCode,
      this.filters,
      this.handleEvent.bind(this));
    return this.subscriptionPromise;
  }
}

export default PresenceRealTimeContext;
