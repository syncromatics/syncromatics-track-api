import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, assignableStops as mockAssignableStops } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When getting assignable stops', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockAssignableStops.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a list of assignable stops', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const assignableStopsPromise = api.customer('SYNC').assignableStops()
      .getPage()
      .then(page => page.list)
      .then(assignableStops => assignableStops); // Do things with list of assignableStops

    return assignableStopsPromise;
  });
});

describe('When retrieving an assignable stop by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockAssignableStops.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get an assignable stop', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const assignableStopPromise = api.customer('SYNC').assignableStop('1st_and_main')
      .fetch()
      .then(assignableStop => assignableStop); // Do things with assignable stop

    return assignableStopPromise;
  });
});
