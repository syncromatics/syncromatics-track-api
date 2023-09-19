import Resource from './Resource';

/**
 * TripCancelation resource
 */
class TripCancelation extends Resource {
  /**
   * Creates new TripCancelation
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning Trip Cancelation data</caption>
   * const client = new Client();
   * const newTCsData = [{
   *   href: '/1/SYNC/serviceadjustments/cancelation/1
   *   tripId: 333,
   *   uncancel: false,
   * },{
   *   href: '/1/SYNC/serviceadjustments/cancelation/2
   *   tripId: 333,
   *   uncancel: true,
   * }];
   * const tripCancelation = new TripCancelation(client, newTCsData);
   * tripCancelation.hydrated == true;
   *
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance, consisting of tripId (number) & uncancel (boolean) values
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
