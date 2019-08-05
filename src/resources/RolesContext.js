import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import Role from './Role';

/**
 * Role querying context
 *
 * This is used to query the list of Roles for a Customer
 */
class RolesContext extends PagedContext {
  /**
   * Creates a new RolesContext
   * @param {Client} client INstance of pre-configured client
   * @param {Object} params Object of querystring parameters to append to the URL
   */
  constructor(client, params) {
    super(client, { ...params });
  }

  /**
   * Sets the query term for the context
   * @param {string} term Query term to search for
   * @returns {RolesContext} returns itself
   */
  withQuery(term) {
    this.params.q = term;
    return this;
  }

  /**
   * Gets the first page for results for this context
   * @returns {Promise} If successful, a page of Role objects
   * @see Role
   */
  getPage() {
    return this.page(Role, '/1/roles');
  }
}

export default RolesContext;
