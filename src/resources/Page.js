import parseLinkHeader from 'parse-link-header';

/**
 * Represents a page of results
 */
class Page {
  /**
   * @callback pageSelector
   * @param {Object} item Item to map to a new object
   * @returns {Object} New object based on the given item
   */

  /**
   * Creates a new page
   * @param {Client} client Instance of pre-configured client
   * @param {pageSelector} selector Function to map each result in the page to a new object
   * @param {string} uri URI of the page of results to request
   * @param {Object} params Object of querystring parameters to append to the URL
   * @param {Number} [params.page=1] Number of the page to request
   * @param {Number} [params.per_page=10] Number of items per page to request
   */
  constructor(client, selector, uri, params) {
    /**
     * List of results in the current page
     * @instance
     */
    this.list = [];

    /**
     * Links to other pages relative to the current page
     * @instance
     */
    this.links = {};

    /**
     * Instance of pre-configured client
     * @instance
     */
    this.client = client;

    /**
     * Function to map each result in the page to a new object
     * @instance
     */
    this.selector = selector;

    /**
     * URI of the page of results to request
     * @instance
     */
    this.uri = uri;

    /**
     * Object of querystring parameters to append to the URL
     * @instance
     */
    this.params = {
      page: 1,
      per_page: 10,
      ...params,
    };
  }

  /**
   * Fetches a page of results via the client
   * @returns {Promise} If successful, an page with a list of the requested items
   */
  fetch() {
    return this.client.authenticated
      .then(() => this.client.get(this.uri, this.params))
      .then((response) => {
        this.links = parseLinkHeader(response.headers.get('Link'));
        return response.json();
      })
      .then((list) => {
        this.list = list.map(this.selector);
        return this;
      });
  }

  /**
   * Indicates whether there is a next page
   * @returns {Boolean} Indication of whether there is a next page
   */
  hasNext() {
    return !!this.links.next;
  }

  /**
   * Fetches the next page of results
   * @returns {Promise} If successful, the result of fetch for the next page.
   *  If there is no next page, an error.
   */
  next() {
    if (!this.hasNext()) {
      return Promise.reject(new Error('No more pages available'));
    }

    this.uri = this.links.next.url;
    this.params = {
      ...this.params,
      ...{
        ...this.links.next,
        // Exclude rel and url
        rel: undefined,
        url: undefined,
      },
    };
    return this.fetch();
  }
}

export default Page;
