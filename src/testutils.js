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
export const toBlob = (value, selector = x => JSON.stringify(x, null, 2), type = 'application/json') =>
  new Blob([selector(value)], { type });

/**
 * Logs the result with a curried prefix
 * @callback curriedLog
 * @param {Object} result Result of Promise to log
 * @returns {Object} Returns result unmodified
 */

/**
 * Thenable log function
 * @example
 * Promise.resolve('foo')
 *  .then(log('Result')) // Logs "Result foo"
 *  .then(x => x == 'foo') // true
 * @param {Array} args Arguments to pass to console.log
 * @returns {curriedLog} Function to be used in a Promise resolution
 */
export const log = (...args) => (result) => {
  console.log(...args, result); // eslint-disable-line no-console

  return result;
};

/**
 * Returns a Promise that resolves after a given timeout
 * @param {Function} resolver Callback function to execute after the timeout
 * @param {Number} timeout Timeout in milliseconds to wait before resolving the Promise
 * @returns {Promise} Returns a Promise that resolves after a given timeout
 */
export const resolveAt = (resolver, timeout) =>
  new Promise(resolve => setTimeout(() => resolve(resolver()), timeout));
