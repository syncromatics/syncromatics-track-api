import Page from './Page';

/**
 * Generic paged query context
 */
class PagedContext {
  /**
   * Creates a new paged context
   * @param {Client} client Instance of pre-configured client
   * @param {Object} [params] Object of querystring parameters to append to the URL
   * @param {Number} [params.page=1] Number of the page to request
   * @param {Number} [params.perPage=10] Number of items per page to request
   * @param {Object[]} [params.sortFields] Array of sort fields to sort the results by
   * @param {string} params.sortFields[].field String representing the field to sort by.
   *  Fields are specified in dotted property notation.
   * @param {string} params.sortFields[].direction Direction by which to sort results.
   *  Valid values are 'asc' and 'desc'.
   */
  constructor(client, params = {}) {
    this.client = client;
    this.params = {
      page: 1,
      perPage: 10,
      sortFields: [],
      ...params,
    };
  }

  /**
   * Sets the page to request for the context
   * @example
   * const context = new PagedContext(...);
   * context
   *   .withPage(3)
   *   .getPage()
   *   .then(page => ...);
   * @param {Number} page Page number to request. (First page is 1)
   * @returns {PagedContext} Returns itself
   */
  withPage(page) {
    this.params.page = page;
    return this;
  }

  /**
   * Sets the maximum number of items per page to request for the context
   * @example
   * const context = new PagedContext(...);
   * context
   *   .withPerPage(20)
   *   .getPage()
   *   .then(page => ...);
   * @param {Number} perPage Number of items per page
   * @returns {PagedContext} Returns itself
   */
  withPerPage(perPage) {
    this.params.perPage = perPage;
    return this;
  }

  /**
   * Sets the requested sort order of the response, clearing any prior sort order
   * @example
   * const context = new PagedContext(...);
   * context
   *   .sortBy('assignment.start', 'desc')
   *   .thenBy('name')
   *   .getPage()
   *   .then(page => ...);
   * @param {string} field String representing the field to sort by.
   *  Fields are specified in dotted property notation.
   * @param {string} [direction=asc] Direction by which to sort results.
   *  Valid values are 'asc' and 'desc'.
   * @returns {PagedContext} Returns itself
   */
  sortedBy(field, direction = 'asc') {
    this.params.sortFields = [
      {
        field,
        direction,
      },
    ];
    return this;
  }

  /**
   * Adds to the requested sort order
   * @example
   * const context = new PagedContext(...);
   * context
   *   .sortBy('assignment.start', 'desc')
   *   .thenBy('name')
   *   .getPage()
   *   .then(page => ...);
   * @param {string} field String representing the field to sort by.
   *  Fields are specified in dotted property notation.
   * @param {string} [direction=asc] Direction by which to sort results.
   *  Valid values are 'asc' and 'desc'.
   * @returns {PagedContext} Returns itself
   */
  thenBy(field, direction = 'asc') {
    this.params.sortFields = [
      ...this.params.sortFields,
      {
        field,
        direction,
      },
    ];
    return this;
  }

  /**
   * Gets the first page of results for this context
   * @param {Object} Type Type of resource to request a page of
   * @param {string} uri URI of the page of results to request
   * @param {Object} [params] Object of querystring parameters to append to the URL
   * @returns {Promise} If successful, a page of objects of Type
   */
  page(Type, uri, params = {}) {
    const fromObject = o => new Type(this.client, o);
    const { sortFields, ...otherParams } = this.params;
    const sort = sortFields
      .map(x => `${x.field} ${x.direction}`)
      .join(',');
    return new Page(this.client, fromObject, uri, { ...otherParams, sort, ...params }).fetch();
  }
}

export default PagedContext;
