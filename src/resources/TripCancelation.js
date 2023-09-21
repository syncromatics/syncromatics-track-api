import Resource from './Resource';

/**
 * TripCancelation resource
 */
class TripCancelation extends Resource {
  /**
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance, consisting of tripId (number) & uncancel (boolean) values
   * 
   * Current fetch/creation is done at the batch-level within TripCancelationsContext
   */
  constructor(client, ...rest) {
    super(client);

    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href' || k === 'code');

    Object.assign(this, newProperties, {
      hydrated,
    });
  }

  /**
   * Makes a href for a given customer code and cancelation id
   * @param {string} customerCode Customer code
   * @param {number} id Cancelation ID
   * @returns {{href: string}} URI to instance of trip cancelation
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/serviceadjustments/cancelation/${id}`,
    };
  }

  /**
   * Fetches the data for this trip cancelation via the client
   * @returns {Promise} If successful, a hydrated instance of this trip cancelation
   */
  fetch() {
    return this.client.get(this.href)
        .then(response => response.json())
        .then(tripCancelation => new TripCancelation(this.client, this, tripCancelation));
  }
}

export default TripCancelation;
