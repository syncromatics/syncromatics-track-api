import Resource from './Resource';
import TripCancelation from "./TripCancelation";

class TripCancelationBatch extends Resource {
    /**
     * Creates a new trip cancelations object for fetching/saving trip cancelations
     *
     * Will populate itself with the values given to it after the client parameter
     * @example <caption>Assigning partial tripCancelations data to a new instance</caption>
     * const client = new Client();
     * const partialData = {
     *   href: '/1/SYNC/serviceadjustments/cancelations',
     *   trip_cancelations: [
     *     { href: '/1/SYNC/serviceadjustments/cancelations/1'' },
     *     { href: '/1/SYNC/serviceadjustments/cancelations/2'' }
     *   ]
     * };
     * const tripCancelations = new TripCancelations(client, partialData);
     *
     * tripCancelationBatch.hydrated == true
     * @param {Client} client Instance of pre-configured client
     * @param {Array} rest Remaining arguments to use in assigning values to this instance
     */
    constructor(client, rest) {
        super(client);
        const {code, ...newProperties} = rest;
        this.customerCode = code;
        const hydrated = !Object.keys(newProperties).every(k => k === 'href' || k === 'customerCode');
        const references = {
            trip_cancelations: newProperties.trip_cancelations
                && newProperties.trip_cancelations.map(m => new TripCancelation(this.client, m)),
        };

        Object.assign(this, newProperties, {
            hydrated,
            ...references,
        });
    }

    /**
     * Makes a href for a given customer code and ID
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
            .then(batch => new TripCancelationBatch(this.client, {...this, ...batch}));
    }

    /**
     * Creates new trip cancelations for customer
     * @returns {Promise} If successful, a hydrated instance of this trip cancelation batch with id
     */
    create() {
        const {client, hydrated, customerCode, ...body} = this;
        return this.client.post(`/1/${this.customerCode}/serviceadjustments/cancelations`, {body})
            .then(response => response.headers.get('location'))
            .then((href) => {
                console.log("response from create: " + href);
                return new TripCancelationBatch(this.client, [{...this, href}]);
            });
    }
}

export default TripCancelationBatch;
