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
   * Claim an incident
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
    return this.client.post(`${this.href}/notes`, { body: note });
  }

  /**
   * Dispose an incident or multiple incidents
   * @param {number|string} dispositionType Disposition of incident FalseAlarm or Cleared
   * @param {string|string[]} incidentIds Single incident ID or array of incident IDs
   * @returns {Promise} If successful, indicates if the incident(s) has been disposed
   */
  dispose(dispositionType, incidentIds) {
    if (Array.isArray(incidentIds)) {
      return this.client.post(`/1/${this.customerCode}/incidents/dispose`, { body: { incidentIds, dispositionType } });
    }
    
    return this.client.post(`${this.href}/dispose`, { body: dispositionType });

  }

  /**
   * @deprecated use dispose() instead
   * Dispose an incident
   * @param {number|string} dispositionType Disposition of incident FalseAlarm or Cleared
   * @returns {Promise} If successful, indicates if the incident has been disposed
   */
  disposeIncident(dispositionType) {
    return this.dispose(dispositionType);
  }
}

export default Incident;
