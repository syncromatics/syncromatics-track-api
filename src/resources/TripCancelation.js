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
   *   tripId: 1,
   *   uncancel: false,
   * },{
   *   tripId: 2,
   *   uncancel: true,
   * }];
   * const tripCancelation = new TripCancelation(client, newTCsData);
   *
   * tripCancelation.hydrated == true;
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance, consisting of tripId (number) & uncancel (boolean) values
   */
  constructor(client, ...rest) {
    super(client);

    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href');

    Object.assign(this, newProperties, {
      hydrated,
    });
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
