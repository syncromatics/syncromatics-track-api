import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import Pattern from './Pattern';
import { EditorErrorResponse } from '../responses';

/**
 * Maps editor validation/conflict JSON to an error response, following the shared response classes.
 * @param {ErrorResponse} error Rejected client response
 * @returns {Promise} Rejection with an EditorErrorResponse, or the original error without JSON
 */
const rejectEditorError = (error) => {
  if (!error || (error.status !== 400 && error.status !== 409) || !error.response) {
    return Promise.reject(error);
  }

  return error.response.json()
    .catch(() => null)
    .then(data => Promise.reject(data && typeof data === 'object'
      ? new EditorErrorResponse(error.response, data) : error));
};

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
   * Loads legacy v1 editor data. Use getPatternForSyncRouteEditorV2 for the new editor.
   * @param {number} patternId Plain pattern ID
   * @returns {Promise<Pattern>} Legacy editor pattern
   */
  getPatternForSyncRouteEditor(patternId) {
    const url = `/1/${this.code}/patterns/editor/${patternId}`;
    return this.client.get(url)
        .then(response => response.json())
        .then(data => new Pattern(this.client, data));
  }

  /**
   * Loads complete v2 editor geometry, stored stops, metadata and eligibility fields.
   * Control points are marked on vertices; stops' waypoint_order indexes into vertices.
   * Stored stop coordinates may differ from the corresponding geometry coordinates.
   * @param {number} patternId Plain pattern ID
   * @returns {Promise<Pattern>} Complete editor pattern, preserving snake_case fields
   */
  getPatternForSyncRouteEditorV2(patternId) {
    return this.client.get(`/2/${this.code}/patterns/editor/${patternId}`)
      .then(response => response.json())
      .then(data => new Pattern(this.client, data))
      .catch(rejectEditorError);
  }

  /**
   * Creates an ordinary, unscheduled pattern from complete snake_case editor state.
   * Supply parent_id or create_route: true. Server validates geometry and permissions.
   * Reload editor data afterward to obtain IDs for new stops and associations.
   * @param {Object} payload Complete save body: name, parent_id/create_route, direction, vertices
   * @returns {Promise<Object>} Saved pattern_id and parent_id; does not automatically reload
   */
  createPattern(payload) {
    return this.client.post(`/2/${this.code}/patterns`, { body: payload })
      .then(response => response.json())
      .catch(rejectEditorError);
  }

  /**
   * Updates an existing pattern, preserving its ID. Send the complete editor state.
   * Retain association_id on retained vertices; it is distinct from the shared stop_id.
   * The server rechecks eligibility. Reload editor data after a successful save.
   * @param {number} patternId Plain pattern ID
   * @param {Object} payload Complete save body: name, parent_id/create_route, direction, vertices
   * @returns {Promise<Object>} Saved pattern_id and parent_id; does not automatically reload
   */
  updatePattern(patternId, payload) {
    return this.client.put(`/2/${this.code}/patterns/${patternId}`, { body: payload })
      .then(response => response.json())
      .catch(rejectEditorError);
  }

  /**
   * Creates a new detour pattern along with child elements, if applicable (stops, waypoints, etc.)
   * @param {Object} patternPayload The pattern and stop data to be sent in the request body
   * @returns {Promise} If successful, the created Pattern object
   */
  createDetourPattern(patternPayload) {
    const url = `/1/${this.code}/patterns/detour`;
    return this.client.post(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: patternPayload,
    })
        .then(response => response.json())
        .then(data => new Pattern(this.client, data));
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
