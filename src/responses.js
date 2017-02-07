/**
 * Generic error response from the client
 * @see Client
 */
export class ErrorResponse {
  /**
   * Creates a new error based on the response from the Fetch API
   * @param {Response} response Instance of {@link https://developer.mozilla.org/en-US/docs/Web/API/Response Response}
   */
  constructor(response) {
    this.response = response;

    const { status, statusText } = response;

    /**
     * HTTP status code
     * @instance
     */
    this.status = status;

    /**
     * Text representation of HTTP status code
     * @instance
     */
    this.message = statusText;
  }
}

/**
 * Error response for "404 Not Found"
 */
export class NotFoundResponse extends ErrorResponse {
}

/**
 * Error response for "403 Forbidden"
 */
export class ForbiddenResponse extends ErrorResponse {
  /**
   * Creates a new forbidden error
   * @param {Response} response Instance of {@link https://developer.mozilla.org/en-US/docs/Web/API/Response Response}
   * @param {string} message Specific message relating to the forbidden response
   */
  constructor(response, message) {
    super(response);

    this.message = message || this.message;
  }
}

/**
 * Error response for any HTTP 500 series error
 */
export class ServerErrorResponse extends ErrorResponse {
  /**
   * Creates a new server error
   * @param {Response} response Instance of {@link https://developer.mozilla.org/en-US/docs/Web/API/Response Response}
   * @param {Object} [json] Body of server error from Track API
   * @param {string} [json.Message] Specific message relating to the server response
   * @param {string} [json.Details] Technical details of server error
   */
  constructor(response, json) {
    super(response);

    /**
     * Specific message relating to the server response
     * @instance
     */
    this.message = json.Message;

    /**
     * Technical details of server error
     * @instance
     */
    this.details = json.Details;
  }
}

const errorResponseMapping = {
  0: r => new ErrorResponse(r),
  5: r => r.json().then(json => new ServerErrorResponse(r, json)),
  403: r => new ForbiddenResponse(r),
  404: r => new NotFoundResponse(r),
};

/**
 * Maps a {@link https://developer.mozilla.org/en-US/docs/Web/API/Response Response} according to its status
 * @param {Response} response Instance of {@link https://developer.mozilla.org/en-US/docs/Web/API/Response Response}
 * @returns {Promise} If successful, returns response. Otherwise, returns an ErrorResponse.
 */
export const mapResponse = (response) => {
  if (response.ok) return Promise.resolve(response);

  const errorResponse = errorResponseMapping[response.status]
    || errorResponseMapping[response.status / 100]
    || errorResponseMapping[0];

  return Promise.reject(errorResponse(response));
};
