import Resource from './Resource';

/**
 * Sign resource
 */
class TripCancelation extends Resource {
  /**
   * Creates new TripCancelations
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
   * const sign = new TripCancelation(client, newTCsData);
   *
   * sign.hydrated == true;
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
   * Fetches the data for this sign via the client
   * @returns {Promise} If successful, a hydrated instance of this sign
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(sign => new Sign(this.client, this, sign));
  }

  /**
   * Updates data for a sign via the client.
   * Note: only updates approach_announcements_enabled and approach_announcements_seconds.
   * @returns {Promise} if successful returns instance of this sign
   */
  update() {
    return this.client.patch(this.href, {
      body: [
        {
          op: 'replace',
          path: '/approach_announcements_enabled',
          value: this.approach_announcements_enabled,
        },
        {
          op: 'replace',
          path: '/approach_announcements_seconds',
          value: this.approach_announcements_seconds,
        },
      ],
    });
  }
}

export default Sign;
