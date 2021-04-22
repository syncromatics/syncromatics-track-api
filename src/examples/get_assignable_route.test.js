import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, assignableRoutes as mockAssignableRoutes } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When getting assignable routes', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockAssignableRoutes.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a list of assignable routes', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const assignableRoutesPromise = api.customer('SYNC').assignableRoutes()
      .getPage()
      .then(page => page.list)
      .then(assignableRoutes => assignableRoutes); // Do things with list of assignableRoutes

    return assignableRoutesPromise;
  });
});

describe('When retrieving an assignable route by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockAssignableRoutes.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get an assignable route', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const assignableRoutePromise = api.customer('SYNC').assignableRoute('blue_line')
      .fetch()
      .then(assignableRoute => assignableRoute); // Do things with assignable route

    return assignableRoutePromise;
  });
});
