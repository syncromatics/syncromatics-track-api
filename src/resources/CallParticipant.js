import Resource from './Resource';

/**
 * CallParticipant resource
 */

class CallParticipant extends Resource {
  /**
   * Creates a new call participant
   *
   * Will populate itself with the values given to it after the client parameter
   * @param {Client} client Instance of pre-configured client
   * @param {Object} rest The object to use ina ssigning values to this instance
   */
  constructor(client, rest) {
    super(client);
    const { code, ...newProperties } = rest;
    this.customerCode = code;
    const hydrated = !Object.keys(newProperties).every(k => k === 'href' || k === 'customerCode');
    Object.assign(this, newProperties, { hydrated });
  }

  /**
   * Makes a href for a given customer code, call ID, and ID
   * @param {string} customerCode Alphanumeric code of the customer
   * @param {Number} callId ID of the call
   * @param {Number} id Call Participant ID
   * @returns {string} URI to instance of call
   */
  static makeHref(customerCode, callId, id) {
    return {
      href: `/1/${customerCode}/calls/${callId}/participants/${id}`,
      code: customerCode,
    };
  }

  /**
   * Fetches the data for this call participant via the client
   * @returns {Promise} If successful, a hydrated instance of this call participant
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(callParticipant => new CallParticipant(this.client, { ...this, ...callParticipant }));
  }

  /**
   * Adds a participant to a call via the client
   * @returns {Promise} If successful, returns the call participant with IDs set
   */
  create() {
    const { client, hydrated, customerCode, callId, ...body } = this;
    return this.client.post(`/1/${customerCode}/calls/${callId}/participants`, { body })
      .then(response => response.headers.get('location'))
      .then((href) => {
        const match = /\/\d+\/\S+\/calls\/(\d+)\/participants\/(\d+)/.exec(href);
        return new CallParticipant(this.client, {
          ...this,
          href,
          callId: parseFloat(match[1]),
          id: parseFloat(match[2]),
        });
      });
  }

  /**
   * Ends the call for this participant via the client
   * @returns {Promise} If successful, returns instance of this call participant
   */
  end() {
    const { href } = CallParticipant.makeHref(this.customerCode, this.callId, this.id);
    this.connection_terminated = new Date().toISOString();
    return this.client.patch(href, {
      body: [
        {
          op: 'replace',
          path: '/connection_terminated',
          value: this.connection_terminated,
        },
      ],
    });
  }
}

export default CallParticipant;
