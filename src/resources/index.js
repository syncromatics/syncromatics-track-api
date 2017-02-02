import 'isomorphic-fetch';
import JWT from 'jwt-client';
import Resource from './Resource';
import Customer from './Customer';
import Client, { ForbiddenResponse } from '../Client';

class Track extends Resource {
  constructor(options) {
    super(new Client(options));
    this.options = {
      autoRenew: true,
      autoRenewMinutesBeforeExpiration: 5,
      ...options,
      ...{
        token: undefined,
        apiKey: undefined,
        username: undefined,
        password: undefined,
      },
    };
  }

  stopAutoRenew() {
    if (this.autoRenewTimeout) {
      clearTimeout(this.autoRenewTimeout);
      this.autoRenewTimeout = null;
    }
  }

  authenticateToken(token) {
    return Promise.resolve(token)
      .then(JWT.read)
      .then((payload) => {
        if (JWT.validate(payload)) {
          JWT.keep(payload);

          this.stopAutoRenew();

          if (this.options.autoRenew) {
            const msBeforeExp = this.options.autoRenewMinutesBeforeExpiration * 60 * 1000;
            const ms = Math.max(payload.claim.exp - msBeforeExp - new Date().getTime(), 0);
            this.autoRenewTimeout = setTimeout(() => this.renewAuthentication(), ms);
          }

          this.client.setAuthenticated(payload.claim);

          return payload.claim;
        }

        JWT.forget();
        this.client.unsetAuthenticated();
        return Promise.reject(new Error('Invalid token or payload'));
      });
  }

  logIn(options) {
    let headers = {
      Accept: 'application/json',
    };

    if (options.token) {
      headers = {
        ...headers,
        Authorization: `Bearer ${options.token.replace(/^Bearer /i, '')}`,
      };
    } else if (options.apiKey) {
      headers = {
        ...headers,
        'Api-Key': options.apiKey,
      };
    } else if (options.username && options.password) {
      headers = {
        ...headers,
        Authorization: `Basic ${btoa(`${options.username}:${options.password}`)}`,
      };
    }

    return this.client.post('/1/login', { headers })
      .then(response => response.text())
      .then(token => this.authenticateToken(token))
      .catch((errorResponse) => {
        if (errorResponse instanceof ForbiddenResponse) {
          return this.logOut()
            .then(() => Promise.reject(new ForbiddenResponse(errorResponse.response, 'Invalid credentials')));
        }

        return Promise.reject(errorResponse);
      });
  }

  logOut() {
    this.stopAutoRenew();
    JWT.forget();
    this.client.unsetAuthenticated();
    return Promise.resolve();
  }

  renewAuthentication() {
    if (JWT.get()) return this.logIn({ token: JWT.get() });

    return Promise.reject(new Error('Not logged in. Call logIn() first.'));
  }

  customers() {
    return this.client.authenticated
      .then(user => Object.keys(user.cust)
        .map(code => ({
          code,
          name: user.cust[code],
        })));
  }

  customer(code) {
    return this.resource(Customer, code);
  }
}

export default Track;
