import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, services as mockServices } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When retrieving a service by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockServices.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a service', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const servicePromise = api
      .customer('SYNC')
      .service(1)
      .fetch()
      .then((service) => service); // Do things with run

    return servicePromise;
  });

  it('should get a service with active detours', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const includeDetours = true;
    const servicePromise = api
      .customer('SYNC')
      .service(1, includeDetours)
      .fetch()
      .then((service) => service); // Do things with run

    return servicePromise;
  });
});
