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
   * Restricts this context to only patterns that are enabled or disabled for operations
   * @example
   * const patterns = new PatternsContext(...);
   * patterns
   *   .withEnabledForOperations()
   *   .getPage()
   *   .then(page => ...);
   * @param {bool} isEnabledForOperations Whether to return only enabled or disabled patterns
   * @returns {PatternsContext} Returns itself
   */
  withEnabledForOperations(isEnabledForOperations = true) {
    this.params.enabled_for_operations = isEnabledForOperations;
    return this;
  }

  /**
   * Restricts this context to only patterns that are assigned to an active service as of asOf.
   * If the customer signs their vehicles in to trips or to runs, this criteria is ignored.
   * @example
   * const patterns = new PatternsContext(...);
   * const now = new Date();
   * patterns
   *   .withAsOf(now)
   *   .getPage()
   *   .then(page => ...);
   * @param {Date} asOf The date to search
   * @returns {PatternsContext} Returns itself
   */
  withAsOf(asOf) {
    let asOfDate;
    if (asOf instanceof Date) {
      asOfDate = asOf.toISOString();
    } else {
      asOfDate = asOf;
    }

    this.params.as_of = asOfDate;
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
