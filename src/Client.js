import 'isomorphic-fetch';
import url from 'url';
import qs from 'qs';
import JWT from 'jwt-client';

export class ErrorResponse {
  constructor(response) {
    this.response = response;

    const { status, statusText } = response;
    this.status = status;
    this.message = statusText;
  }
}

export class NotFoundResponse extends ErrorResponse {
}

export class ForbiddenResponse extends ErrorResponse {
  constructor(response, message) {
    super(response);

    this.message = message || this.message;
  }
}

export class ServerErrorResponse extends ErrorResponse {
  constructor(response, json) {
    super(response);

    this.message = json.Message;
    this.details = json.Details;
  }
}

const errorResponseMapping = {
  0: r => new ErrorResponse(r),
  5: r => r.json().then(json => new ServerErrorResponse(r, json)),
  403: r => new ForbiddenResponse(r),
  404: r => new NotFoundResponse(r),
};

const mapResponse = (response) => {
  if (response.ok) return response;

  const errorResponse = errorResponseMapping[response.status]
    || errorResponseMapping[response.status / 100]
    || errorResponseMapping[0];

  return Promise.reject(errorResponse(response));
};

class Client {
  constructor(options = {}) {
    this.options = {
      baseUri: 'https://track-api.syncromatics.com',
      ...options,
    };

    // Initialize authenticated promise
    this.unsetAuthenticated();
  }

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

  request(method, uri, options = {}) {
    const opts = {
      headers: {},
      method,
      ...options,
    };

    if (JWT.get() && !opts.headers.Authorization && !opts.headers['Api-Key']) {
      opts.headers.Authorization = JWT.get();
    }

    return fetch(this.resolve(uri), opts)
      .then(mapResponse);
  }

  get(uri, params, ...args) {
    return this.request('GET', this.resolve(uri, params), ...args);
  }

  post(...args) {
    return this.request('POST', ...args);
  }

  setAuthenticated(user) {
    // Resolve outstanding promise
    if (this.authenticatedResolve) this.authenticatedResolve(user);
  }

  unsetAuthenticated() {
    // Set a new promise
    this.authenticated = new Promise((resolve) => {
      this.authenticatedResolve = resolve;
    });
  }
}

export default Client;
