import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, trips as mockTrips } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When retrieving a trip by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockTrips.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a trip', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const tripPromise = api.customer('SYNC').trip(3)
      .fetch()
      .then(trip => trip); // Do things with trip

    return tripPromise;
  });
});
