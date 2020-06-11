import Resource from './Resource';

/**
 * Incident resource
 */
class Incident extends Resource {
  /**
   * Creates a new incident
   *
   * Will populate itself with the values given to it after the client parameter
   * @param {Client} client Instance of pre-configured client
   * @param {Object} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, rest) {
    super(client);
    const {
      code,
      ...newProperties
    } = rest;
    this.customerCode = code;
    const hydrated = !Object.keys(newProperties).every(k => k === 'href' || k === 'customerCode');
    Object.assign(this, newProperties, {
      hydrated,
    });
  }

  /**
   * Makes a href for a given incident code and ID
   * @param {string} customerCode Customer code
   * @param {Number} id Incident ID
   * @returns {string} URI to instance of incident
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/incidents/${id}`,
      code: customerCode,
    };
  }

  /**
   * Clain an incident
   * @returns {Promise} If successful, indicates if the incident has been claimed with a boolean
   */
  claim() {
    return this.client.post(`${this.href}/claim`);
  }

  /**
   * Add note to an existing incident
   * @param {string} note Note to be added
   * @returns {Promise} If successful, indicates if the note has been added with a boolean
   */
  addNote(note) {
    return this.client.post(`${this.href}/notes`, {
      note,
    });
  }

  /**
   * Add note to an existing incident
   * @param {number} disposeType Dispose Type: 1: False Alarm, 2: Cleared
   * @returns {Promise} If successful, indicates if the incident has been disposed
   */
  disposeIncident(disposeType) {
    return this.client.post(`${this.href}/dispose`, {
      disposeType,
    });
  }
}

export default Incident;