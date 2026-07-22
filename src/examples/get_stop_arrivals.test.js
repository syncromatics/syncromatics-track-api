import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, stopArrivals as mockStopArrivals } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When retrieving arrivals for a stop', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockStopArrivals.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a list of arrivals for the stop', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const arrivalsPromise = api.customer('SYNC').stop(1)
      .arrivals()
      .then(arrivals => arrivals); // Do things with list of arrivals

    return arrivalsPromise;
  });
});
