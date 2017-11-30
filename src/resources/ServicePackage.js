import Resource from './Resource';
import Service from './Service';

/**
 * Service package resource
 */
class ServicePackage extends Resource {
  /**
   * Creates a new ServicePackage
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial ServicePackage data to a new instance</caption>
   * const client = new Client();
   * const partialData = {
   *   href: '/1/SYNC/service_packages/1',
   *   name: 'First Package',
   * };
   * const servicePackage = new ServicePackage(client, partialData);
   * servicePackage.hydrated === true;
   *
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, ...rest) {
    super(client);

    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href');

    const references = {
      services: newProperties.services && newProperties.services.map(s =>
        new Service(this.client, s)),
    };

    Object.assign(this, newProperties, {
      hydrated,
      ...references,
    });
  }

  /**
   * Makes a href for a given customer code and ID
   * @param {string} customerCode Customer code
   * @param {number} id Service Package ID
   * @returns {{href: string}} URI to instance of this service package
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/service_packages/${id}`,
    };
  }

  /**
   * Fetches the data for this service package via the client
   * @returns {Promise} If Successful, a hydrated instance of this service package
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(servicePackage => new ServicePackage(this.client, this, servicePackage));
  }
}

export default ServicePackage;
