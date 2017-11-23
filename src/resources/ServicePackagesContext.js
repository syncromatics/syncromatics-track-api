import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import ServicePackage from './ServicePackage';

/**
 * ServicePackage querying context
 *
 * This is used to query the list of service packages for a customer
 */
class ServicePackagesContext extends PagedContext {
  /**
   * Creates a new service package context
   * @param {Client} client Instance of pre-configured client
   * @param {string} customerCode Customer code
   * @param {Object} params Object of querystring parameters to append to the URL
   */
  constructor(client, customerCode, params) {
    super(client, { ...params });
    this.code = customerCode;
  }

  /**
   * Sets the query term for the context
   * @example
   * const servicePackages = new ServicePackagesContext(...);
   * servicePackages
   *   .withQuery('blue')
   *   .getPage()
   *   .then(page => ...);
   * @param {string} term Query term to search for
   * @returns {ServicePackagesContext} Returns itself
   */
  withQuery(term) {
    this.params.q = term;
    return this;
  }

  /**
   * Gets the first page of results for this context
   * @returns {Promise} If successful, a page of ServicePackage objects
   * @see ServicePackage
   */
  getPage() {
    return this.page(ServicePackage, `/1/${this.code}/service_packages`);
  }
}

export default ServicePackagesContext;
