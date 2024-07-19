import RealTimeContext from './RealTimeContext';

/**
 * A real time context that can be used to generate subscriptions to Detour entities.
 */
class DetoursRealTimeContext extends RealTimeContext {
    /**
     * Creates a context that can subscribe to Detour updates.
     * @param {RealTimeClient} realTimeClient Pre-configured instance of RealTimeClient.
     * @param {string} customerCode The customer code to query for updates.
     */
    constructor(realTimeClient, customerCode) {
        const entityName = 'DETOURS';
        super(realTimeClient, entityName, customerCode);
        this.filters = {
            customers: [],
        };
    }

    /**
     * Restrict subscriptions created by this context to a single customer.
     * @param {Resource|string} customer Href or resource representation of a Customer.
     * @returns {DetoursRealTimeContext} Context with filter applied.
     */
    forCustomer(customer) {
        this.assertSubscriptionNotStarted();
        this.filters.customers = [customer].map(RealTimeContext.resolveHref);
        return this;
    }
}

export default DetoursRealTimeContext;