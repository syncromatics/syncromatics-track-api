import Resource from './Resource';
import TripCancelation from "./TripCancelation";

class TripCancelationBatch extends Resource {
    /**
     * Creates a new TripCancelationBatch object for fetching/saving trip cancelations
     * @param {Client} client Instance of pre-configured client
     * @param {Array} rest Remaining arguments to use in assigning values to this instance
     */
    constructor(client, rest) {
        super(client);
        const {code, ...newProperties} = rest;
        this.customerCode = code;
        const hydrated = !Object.keys(newProperties).every(k => k === 'href' || k === 'customerCode');
        const references = {
            cancelations: newProperties.cancelations
                && newProperties.cancelations.map(m => new TripCancelation(this.client, m)),
        };
        Object.assign(this, newProperties, {
            hydrated,
            ...references,
        });
    }

    /**
     * Makes a href for a given customer code
     * @param {string} customerCode  Alphanumeric code of the customer
     * @returns {object} href object containing URL for the instance
     */
    static makeHref(customerCode) {
        return {
            href: `/1/${customerCode}/serviceadjustments/cancelations`,
            code: customerCode,
        };
    }

    /**
     * Fetches current trip cancelation data for customer
     * @returns {Promise} If successful, a hydrated instance of this trip cancelation batch
     */
    fetch() {
        return this.client.get(this.href)
            .then(response => response.json())
            .then(cancelations => new TripCancelationBatch(this.client, {...this, ...cancelations}));
    }

    /**
     * Create new cancelations for customer
     * @returns {Promise} If successful, a hydrated instance of this trip cancelation batch
     */
    create() {
        const {client, hydrated, customerCode, ...body} = this;
        return this.client.post(`/1/${this.customerCode}/serviceadjustments/cancelations`, {body})
            .then(response => response.json())
            .then(cancelations => new TripCancelationBatch(this.client, {...this, ...cancelations}));
    }
}

export default TripCancelationBatch;
