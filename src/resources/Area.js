import Resource from './Resource';
import Vehicle from './Vehicle';

/**
 * Area resource
 */
class Area extends Resource {
  /**
   * Creates a new area.
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial area data to a new instance</caption>
   * const client = new Client();
   * const partialAreaData = {
   *   href: '/1/SYNC/areas/1',
   *   id: 1,
   *   name: 'South Yard',
   *   encoded_polygon: 'crneFnwljVa...',
   *   area_type: 'Yard',
   * };
   * const area = new Area(client, partialAreaData);
   * area.hydrated === true;
   *
   * @param {Client} client Instance of pre-configured client
   * @param  {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, ...rest) {
    super(client);

    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href' || k === 'code');

    const references = {
      vehicles: newProperties.vehicles && newProperties.vehicles.map(v =>
        new Vehicle(this.client, v)),
    };

    Object.assign(this, newProperties, {
      hydrated,
      ...references,
    });
  }

  /**
   * Makes a href for a given customer code and ID
   * @param {string} customerCode Customer code
   * @param {number} id Area ID
   * @returns {{href: string}} URI to instance of area
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/areas/${id}`,
    };
  }

  /**
   * Fetches the data for this area via the client
   * @returns {Promise} If successful, a hydrated instance of this area
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(area => new Area(this.client, this, area));
  }
}

export default Area;
