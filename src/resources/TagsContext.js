import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import Tag from './Tag';

/**
 * Tag querying context
 *
 * This is used to query the list of tags for a customer
 */
class TagsContext extends PagedContext {
  /**
   * Creates a new tag context
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
   * const tags = new TagContext(...);
   * tags
   *   .withQuery('LA')
   *   .getPage()
   *   .then(page => ...);
   * @param {string} term Query term to search for
   * @returns {TagsContext} Returns itself
   */
  withQuery(term) {
    this.params.q = term;
    return this;
  }

  /**
   * Gets the first page of results for this context
   * @returns {Promise} If successful, a page of Tag objects
   * @see Tag
   */
  getPage() {
    return this.page(Tag, `/1/${this.code}/tags`);
  }
}

export default TagsContext;
