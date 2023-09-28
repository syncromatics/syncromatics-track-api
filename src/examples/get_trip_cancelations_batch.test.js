import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, tripCancelationBatches as mocks } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When retrieving trip cancelations by customer', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mocks.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get trip cancelations batch', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });
    
    const tripCancelationBatchPromise = api.customer('SYNC').tripCancelationBatch()
      .fetch()
      .then(msg => msg); // Do things with message

    return tripCancelationBatchPromise;
  });
});

describe('When creating trip cancelations', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mocks.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should save trip cancelations batch', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const tripCancelationBatchPromise = api.customer('SYNC').tripCancelationBatch({
      cancelations: [
        {
          customerId: 1,
        },
        {
          customerId: 1,
        },
      ],
    })
      .create()
      .then(msg => msg); // Do things with msg

    return tripCancelationBatchPromise;
  });
});

