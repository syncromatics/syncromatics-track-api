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
