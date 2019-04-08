import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import User from './User';

/**
 * User querying context
 *
 * This is used to query the list of users for a customer
 */
class UsersContext extends PagedContext {
  /**
   * Creates a new users context
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
   * const users = new UsersContext(...);
   * users
   *   .withQuery('Charlie')
   *   .getPage()
   *   .then(page => ...);
   * @param {string} term Query term to search for
   * @returns {UsersContext} Returns itself
   */
  withQuery(term) {
    this.params.q = term;
    return this;
  }

  /**
   * Gets the first page of results for this context
   * @returns {Promise} If successful, a page of User objects
   * @see User
   */
  getPage() {
    return this.page(User, `/1/${this.code}/users`);
  }
}

export default UsersContext;
