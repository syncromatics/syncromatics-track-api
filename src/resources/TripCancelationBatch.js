import Resource from './Resource';
import DispatchMessage from './DispatchMessage';
import TripCancelation from "./TripCancelation";

class TripCancelationBatch extends Resource {
  /**
   * Creates a new trip cancelation batch
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial tripCancelationBatch data to a new instance</caption>
   * const client = new Client();
   * const partialData = {
   *   href: '/1/SYNC/serviceadjustments/cancelations/batches/90892e24-5279-4066-b109-a112925edb89',
   *   trip_cancelations: [
   *     { href: '/1/SYNC/serviceadjustments/cancelations/1'' },
   *     { href: '/1/SYNC/serviceadjustments/cancelations/2'' }
   *   ]
   * };
   * const tripCancelationBatch = new TripCancelationBatch(client, partialData);
   *
   * tripCancelationBatch.hydrated == true
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, rest) {
    super(client);
    const { code, ...newProperties } = rest;
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
   * @param {string} id ID of the trip cancelation batch
   * @returns {object} href object containing URL for the instance
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/serviceadjustments/cancelations/batches/${id}`,
      code: customerCode,
    };
  }

  /**
   * Fetches the data for this trip cancelation batch via the client
   * @returns {Promise} If successful, a hydrated instance of this trip cancelation batch
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(batch => new TripCancelationBatch(this.client, { ...this, ...batch }));
  }

  /**
   * Creates a new trip cancelation batch via the client
   * @returns {Promise} If successful, a hydrated instance of this trip cancelation batch with id
   */
  create() {
    const { client, hydrated, customerCode, ...body } = this;
    return this.client.post(`/1/${customerCode}/serviceadjustments/cancelations/batches`, { body })
      .then(response => response.headers.get('location'))
      .then((href) => {
        const match = /\/\d+\/\S+\/serviceadjustments\/cancelations\/batches\/(\S+)/.exec(href);
        return new TripCancelationBatch(this.client, { ...this, href, id: match[1] });
      });
  }
}

export default TripCancelationBatch;
