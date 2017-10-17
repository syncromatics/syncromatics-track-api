let requestId = 0;

export const AUTHENTICATION = {
  REQUEST: 'AUTHENTICATION_REQUEST',
  SUCCESS: 'AUTHENTICATION_SUCCESS',
  FAILURE: 'AUTHENTICATION_FAILURE',
};

export const SUBSCRIPTION_START = {
  REQUEST: 'SUBSCRIPTION_START_REQUEST',
  SUCCESS: 'SUBSCRIPTION_START_SUCCESS',
  FAILURE: 'SUBSCRIPTION_START_FAILURE',
};

export const SUBSCRIPTION_END = {
  REQUEST: 'SUBSCRIPTION_END_REQUEST',
  SUCCESS: 'SUBSCRIPTION_END_SUCCESS',
  FAILURE: 'SUBSCRIPTION_END_FAILURE',
};

/**
 * Creates a Track Real Time API control message for authenticating a connection.
 * @param {string} jwt A pre-authenticated JSON Web Token for authorizing this connection.
 * @returns {Object} The created authentication request message.
 */
const createAuthRequest = jwt => ({
  type: AUTHENTICATION.REQUEST,
  request_id: 'authRequest',
  token: jwt,
});

/**
 * Creates a Track Real Time API control message for creating a subscription.
 * @param {string} entity The entity for which the subscription should be created.
 * @param {*} customerCode Customer Code for which the subscription should be created.
 * @param {Object.<string, Href>} filters A map that maps filter attribute names to arrays of hrefs.
 * @returns {Object} The created subscription request message.
 */
const createSubscriptionRequest = (entity, customerCode, filters = {}) => {
  requestId += 1;
  return {
    type: SUBSCRIPTION_START.REQUEST,
    request_id: requestId,
    customer: customerCode,
    entity,
    ...filters,
  };
};

export const creators = {
  createAuthRequest,
  createSubscriptionRequest,
};
