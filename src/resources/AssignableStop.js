import Resource from './Resource';

/**
 * AssignableStop resource
 */
class AssignableStop extends Resource {
  /**
   * Creates a new AssignableStop
   *
   * @param {Client} client Instance of pre-configured client
   * @param  {Array} rest Remaining arguments to use in assigning values to this instance
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
   * Makes a href for a given customer code and ID
   *
   * @param {string} customerCode Customer code
   * @param {string} id  Assignable Stop ID
   * @returns {{href: string}} URI to instance of Assignable Stop
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/assignable_entities/stops/${id}`,
      code: customerCode,
    };
  }

  /**
   * Fetches the data for this assignable stop via the client.
   *
   * @returns {Promise} If successful, a hydrated instance of this assignable stop
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(assignableStop => new AssignableStop(this.client, this, assignableStop));
  }
}

export default AssignableStop;
