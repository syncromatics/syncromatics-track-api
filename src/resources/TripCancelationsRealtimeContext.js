import RealTimeContext from './RealTimeContext';

/**
 * A real time context that can be used to generate subscriptions to TripCancelation entities.
 */
class TripCancelationsRealTimeContext extends RealTimeContext {
    /**
     * Creates a context that can subscribe to TripCancelation updates.
     * @param {RealTimeClient} realTimeClient Pre-configured instance of RealTimeClient.
     * @param {string} customerCode The customer code to query for updates.
     */
    constructor(realTimeClient, customerCode) {
        const entityName = 'TRIP_CANCELATIONS';
        super(realTimeClient, entityName, customerCode);
        this.filters = {
            customers: [],
        };
    }

    /**
     * Restrict subscriptions created by this context to a single customer.
     * @param {Resource|string} customer Href or resource representation of a Customer.
     * @returns {TripCancelationsRealTimeContext} Context with filter applied.
     */
    forCustomer(customer) {
        return this.forCustomers([customer]);
    }

    /**
     * Restrict subscriptions created by this context to a set of customers.
     * @param {Array.<Resource|string>} customers Array of href or resource representations of
     * Customers.
     * @returns {TripCancelationsRealTimeContext} Context with filter applied.
     */
    forCustomers(customers) {
        this.assertSubscriptionNotStarted();
        this.filters.customers = customers.map(RealTimeContext.resolveHref);
        return this;
    }
}

export default TripCancelationsRealTimeContext;
