import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import Pattern from './Pattern';

/**
 * Route querying context
 *
 * This is used to query the list of patterns for a customer
 */
class PatternsContext extends PagedContext {
  /**
   * Creates a new route context
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
   * const patterns = new PatternsContext(...);
   * patterns
   *   .withQuery('blue')
   *   .getPage()
   *   .then(page => ...);
   * @param {string} term Query term to search for
   * @returns {PatternsContext} Returns itself
   */
  withQuery(term) {
    this.params.q = term;
    return this;
  }

  /**
   * Appends an expanded property for the context
   * @example
   * const patterns = new PatternsContext(...);
   * patterns
   *   .withExpandedProperty('stops')
   *   .getPage()
   *   .then(page => ...);
   * @param {string} propertyName Property to expand the model for
   * @returns {PatternsContext} Returns itself
   */
  withExpandedProperty(propertyName) {
    this.params.expand = [
      ...(this.params.expand || '').split(','),
      propertyName,
    ]
      .filter(x => x)
      .join(',');
    return this;
  }

  /**
   * Gets the first page of results for this context
   * @returns {Promise} If successful, a page of Pattern objects
   * @see Pattern
   */
  getPage() {
    return this.page(Pattern, `/1/${this.code}/patterns`);
  }
}

export default PatternsContext;
