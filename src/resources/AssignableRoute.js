import Resource from './Resource';

/**
 * AssignableRoute resource
 */
class AssignableRoute extends Resource {
  /**
   * Creates a new AssignableRoute
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
   * @param {string} id  Assignable Route ID
   * @returns {{href: string}} URI to instance of Assignable Route
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/assignable_entities/routes/${id}`,
      code: customerCode,
    };
  }

  /**
   * Fetches the data for this assignable route via the client.
   *
   * @returns {Promise} If successful, a hydrated instance of this assignable route
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(assignableRoute => new AssignableRoute(this.client, this, assignableRoute));
  }
}

export default AssignableRoute;
