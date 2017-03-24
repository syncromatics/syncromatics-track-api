import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, stops as mockStops } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When searching for stops by name', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockStops.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a list of stops', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const stopsPromise = api.customer('SYNC').stops()
      .withQuery('1st') // Stops containing "1st" in their name
      .getPage()
      .then(page => page.list)
      .then(stops => stops); // Do things with list of stops

    return stopsPromise;
  });
});

describe('When retrieving a stop by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockStops.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a stop', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const stopsPromise = api.customer('SYNC').stop(1)
      .fetch()
      .then(stop => stop); // Do things with stop

    return stopsPromise;
  });
});
