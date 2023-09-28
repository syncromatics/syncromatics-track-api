import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, dispatchMessageBatches as mocks } from '../mocks';

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
    
    const tripCancelationBatchPromise = api.customer('SYNC').tripCancelationBatch("SYNC")
      .fetch()
      .then(msg => msg); // Do things with message

    return tripCancelationBatchPromise;
  });
});

describe('When creating trip cancelations batch', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mocks.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should save trip cancelations batch', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const tripCancelationBatchPromise = api.customer('SYNC').tripCancelationBatch({
      trip_cancelations: [
        {
          vehicle: { href: '/1/SYNC/vehicles/1' },
          driver: { href: '/1/SYNC/drivers/1' },
          message_direction: 'FromDispatch',
          pattern: { href: '/1/SYNC/patterns/1' },
          dispatch_user: { href: '/1/users/1' },
          customerId: 1,
          message: 'Radio chatter',
        },
        {
          vehicle: { href: '/1/SYNC/vehicles/2' },
          driver: { href: '/1/SYNC/drivers/1' },
          message_direction: 'FromDispatch',
          pattern: { href: '/1/SYNC/patterns/1' },
          dispatch_user: { href: '/1/users/1' },
          customerId: 1,
          message: 'Radio chatter',
        },
      ],
    })
      .create()
      .then(msg => msg); // Do things with msg

    return tripCancelationBatchPromise;
  });
});

