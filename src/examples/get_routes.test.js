import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, routes as mockRoutes } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When searching for routes by name', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockRoutes.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a list of routes', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const routesPromise = api.customer('SYNC').routes()
      .withQuery('blue') // Routes containing "blue" in their name
      .getPage()
      .then(page => page.list)
      .then(routes => routes); // Do things with list of routes

    return routesPromise;
  });
});

describe('When retrieving a route by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockRoutes.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a route', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const routesPromise = api.customer('SYNC').route(1)
      .fetch()
      .then(route => route); // Do things with route

    return routesPromise;
  });
});
