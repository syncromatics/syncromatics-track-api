import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, dispatchMessageBatches as mocks } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When retrieving a dispatch message batch by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mocks.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a dispatch message batch', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const batchId = '90892e24-5279-4066-b109-a112925edb89';
    const dispatchMessageBatchPromise = api.customer('SYNC').dispatchMessageBatch(batchId)
      .fetch()
      .then(dispatchMessageBatch => dispatchMessageBatch); // Do things with dispatch message

    return dispatchMessageBatchPromise;
  });
});

describe('When creating a dispatch message batch', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mocks.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should save a dispatch message batch', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const dispatchMessageBatchPromise = api.customer('SYNC').dispatchMessageBatch({
      dispatch_messages: [
        {
          vehicle: { href: '/1/SYNC/vehicles/1' },
          driver: { href: '/1/SYNC/drivers/1' },
          message_direction: 'FromDispatch',
          route: { href: '/1/SYNC/routes/1' },
          dispatch_user: { href: '/1/users/1' },
          customerId: 1,
          message: 'Radio chatter',
        },
        {
          vehicle: { href: '/1/SYNC/vehicles/2' },
          driver: { href: '/1/SYNC/drivers/1' },
          message_direction: 'FromDispatch',
          route: { href: '/1/SYNC/routes/1' },
          dispatch_user: { href: '/1/users/1' },
          customerId: 1,
          message: 'Radio chatter',
        },
      ],
    })
    .create()
    .then(dispatchMessageBatch => dispatchMessageBatch); // Do things with dispatchMessageBatch

    return dispatchMessageBatchPromise;
  });
});

