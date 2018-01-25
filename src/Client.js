import 'isomorphic-fetch';
import url from 'url';
import qs from 'qs';
import JWT from 'jwt-client';
import { mapResponse } from './responses';

export const DEFAULT_TRACK_API_HOST = 'track-api.syncromatics.com';

/**
 * Collection of functions to make HTTP requests to the Track API
 */
class Client {
  /**
   * Creates a new client
   * @param {Object} options Options for using the client to connect to the Track API
   * @param {string} [options.baseUri] The base URI for the Track API. Defaults to production.
   * @param {string} [options.realTimeUri] The URI for the WebSocket connection to the RealTime API.
   * Defaults to production.
   */
  constructor(options = {}) {
    this.options = {
      baseUri: `https://${DEFAULT_TRACK_API_HOST}`,
      ...options,
    };

    // Initialize authenticated promise
    this.unsetAuthenticated();
  }

  /**
   * Resolves a relative URI against the client's base URI
   * @param {string} uri URI or URL to resolve relative to the client's base URI
   * @param {Object} queryStringParams Object of querystring parameters to append to the URL
   * @returns {string} Absolute URL with querystring parameters appended
   */
  resolve(uri, queryStringParams) {
    const parsedUrl = url.parse(url.resolve(this.options.baseUri, uri));
    const newParams = {
      ...qs.parse(parsedUrl.query),
      ...queryStringParams,
    };
    const search = qs.stringify(newParams);
    parsedUrl.search = search ? `?${search}` : '';
    return url.format(parsedUrl);
  }

  /**
   * Makes an HTTP request
   * @param {string} method HTTP method to use (GET, POST, etc.)
   * @param {string} uri URI to make request to after resolving
   * @param {Object} [options] Options to pass along to the {@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API fetch} functions
   * @param {Object} [options.headers] Object of headers to include in the request
   * @param {string} [options.method] Override the HTTP method to use.
   * @returns {Promise} Promise of a {@link https://developer.mozilla.org/en-US/docs/Web/API/Response Response} if successful, or of {@link ErrorResponse} if unsuccessful
   */
  request(method, uri, options = {}) {
    let {
      body,
    // eslint-disable-next-line prefer-const
      ...rest
    } = options;

    if (body && !(body instanceof Blob)) {
      body = Client.toBlob(body);
    }

    const opts = {
      headers: {},
      method,
      body,
      ...rest,
    };

    if (JWT.get() && !opts.headers.Authorization && !opts.headers['Api-Key']) {
      opts.headers.Authorization = JWT.get();
    }

    return fetch(this.resolve(uri), opts)
      .then(mapResponse);
  }

  /**
   * Convenience method of request() to make an HTTP GET request
   * @param {string} uri URI to make request to after resolving.
   * @param {Object} params Object of querystring parameters to append to the URL
   * @param {Array} args Any other arguments for request()
   * @returns {Promise} Promise from request()
   * @see request
   */
  get(uri, params, ...args) {
    return this.request('GET', this.resolve(uri, params), ...args);
  }

  /**
   * Convenience method of request() to make an HTTP POST request
   * @param {Array} args Any other arguments for request()
   * @returns {Promise} Promise from request()
   * @see request
   */
  post(...args) {
    return this.request('POST', ...args);
  }

  /**
   * Convenience method of request() to make an HTTP PUT request
   * @param {Array} args Any other arguments for request()
   * @returns {Promise} Promise from request()
   * @see request
   */
  put(...args) {
    return this.request('PUT', ...args);
  }

  /**
   * Convenience method of request() to make an HTTP DELETE request
   * @param {Array} args Any other arguments for request()
   * @returns {Promise} Promise from request()
   * @see request
   */
  delete(...args) {
    return this.request('DELETE', ...args);
  }

  /**
   * Sets the internal authentication state of the client to "authenticated" with given user
   * @param {Object} user User object representing the payload from the JSON Web Token
   * @returns {void}
   * @see unsetAuthenticated
   */
  setAuthenticated(user) {
    // Resolve outstanding promise
    if (this.authenticatedResolve) this.authenticatedResolve(user);
  }

  /**
   * Clears the internal authentication state of the client
   * @returns {void}
   * @see setAuthenticated
   */
  unsetAuthenticated() {
    // Set a new promise
    this.authenticated = new Promise((resolve) => {
      this.authenticatedResolve = resolve;
    });
  }

  /**
   * @callback toBlobSelector
   * @param {Object} object Object to map to a string
   * @returns {string} String representation of object
   */

  /**
   * Makes a Blob object
   * @param {Object} value Value to encode in Blob
   * @param {toBlobSelector} [selector] Function to map the value to a string
   * @param {string} [type=application/json] MIME type of Blob
   * @returns {Blob} Instance of Blob
   */
  static toBlob(value, selector = x => JSON.stringify(x, null, 2), type = 'application/json') {
    return new Blob([selector(value)], { type });
  }
}

export default Client;
