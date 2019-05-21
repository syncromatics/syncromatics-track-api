import Resource from './Resource';

/**
 * ReportingTicket resource
 */
class ReportingTicket extends Resource {
  /**
   * Creates a new ReportingTicket object
   *
   * Will populate itself with the values given to it after the client parameter
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, ...rest) {
    super(client);

    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href' || k === 'code');

    Object.assign(this, newProperties, { hydrated });
  }

  /**
   * Makes a href for a given customer code
   * @param {string} customerCode Customer code
   * @returns {string} URI to instance of reporting ticket
   */
  static makeHref(customerCode) {
    return {
      href: `/1/${customerCode}/reporting_ticket`,
      code: customerCode,
    };
  }

  /**
   * Generates a new reporting ticket via the client
   * @returns {Promise} If successful, a hydrated instance of a fresh reporting ticket
   */
  fetch() {
    return this.client.post(this.href)
      .then(response => response.json())
      .then(reportingTicket => new ReportingTicket(this.client, this, reportingTicket));
  }
}

export default ReportingTicket;
