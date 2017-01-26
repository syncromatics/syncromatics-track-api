import 'isomorphic-fetch';
import url from 'url';
import JWT from 'jwt-client';

const log = (...args) => {
  console.log(...args);
  return args[args.length - 1];
};

const logWith = (...args) => log.bind(null, ...args);

const credentialsOptions = {
  apiKey: undefined,
  username: undefined,
  password: undefined,
  token: undefined,
};

class Track {
  /**
   * @param {Object} [options] - Options for logging in. Requires one of username/password, apiKey,
   * or token.
   * @param {string} [options.username] - Username to authenticate along with password.
   * @param {string} [options.password] - Password to authenticate along with username.
   * @param {string} [options.apiKey] - API key to authenticate with.
   * @param {string} [options.token] - Token to authenticate with.
   * @param {boolean} [options.autoRenew=true] - Indicates whether to automatically renew the
   * authenticated when the token is near expiration.
   * @param {number} [options.autoRenewMinutesBeforeExpiration=5] - Number of minutes to
   * automatically renew before the token is set to expire.
   * @param {function} [options.onAutoRenew] - Function called when the token is successfully
   * automatically renewed. Function is given the user payload.
   */
  constructor(options) {
    const defaults = {
      host: 'https://track-api.syncromatics.com',
      autoRenew: true,
      autoRenewMinutesBeforeExpiration: 5,
      onAutoRenew: () => {},
    };

    this.options = Object.assign({}, defaults, options, credentialsOptions);
    this.authenticateToken = this.authenticateToken.bind(this);
    // this.autoRenewTimeout = undefined;
    // TODO: attempt to log in with options
  }

  authenticateToken(token) {
    return Promise.resolve(token)
    .then(JWT.read)
    .then((payload) => {
      if (JWT.validate(payload)) {
        JWT.keep(payload);

        if (this.autoRenewTimeout) {
          clearTimeout(this.autoRenewTimeout);
        }

        if (this.options.autoRenew) {
          const msBeforeExp = this.options.autoRenewMinutesBeforeExpiration * 60 * 1000;
          const ms = Math.max(payload.claim.exp - msBeforeExp - new Date().getTime(), 0);
          this.autoRenewTimeout = setTimeout(() => {
            this.logIn({ token: JWT.get() });
          }, ms);
        }

        return payload.claim;
      }

      // TODO: figure out error state
      JWT.forget();
      return Promise.reject(new Error('Invalid token or payload'));
    })
    .then(logWith('authenticateToken', 'Validated token'));
  }
  /**
   * Log in and return the user associated with the credentials
   * @param {Object} [options] - Options for logging in. Requires one of username/password, apiKey,
   * or token.
   * @param {string} [options.username] - Username to authenticate along with password.
   * @param {string} [options.password] - Password to authenticate along with username.
   * @param {string} [options.apiKey] - API key to authenticate with.
   * @param {string} [options.token] - Token to authenticate with.
   * @returns {Promise} - Promise of the user payload.
   */
  logIn(options) {
    // TODO: Log in and begin watcher on expiration of token
    const opts = Object.assign({}, options);
    console.log(opts);
    const body = new FormData();
    body.append('username', opts.username);
    body.append('password', opts.password);

    return fetch(url.resolve(this.options.host, '/1/login'), {
      method: 'POST',
      body,
    })
      .then(response => response.text())
      .then(this.authenticateToken);
  }

  // logOut() {
  //   // TODO: Clear token and watcher
  // }

  // meta() {
  //   // TODO: return API v1 metadata
  // }

  // customers() {
  //   // TODO: return list of customer contexts based on token
  // }

  // customer(code) {
  //   // TODO: return customer context
  // }
}

export default Track;

export const FOO = 'FOO!';
