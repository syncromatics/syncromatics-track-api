import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, agencies as mockAgencies } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe("When retrieving a customer's agency information", () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockAgencies.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get the requested agency', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const agencyPromise = api.customer('SYNC').agency()
      .fetch()
      .then(agency => agency);

    return agencyPromise;
  });
});

describe("When updating a customer's agency information", () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockAgencies.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should update the agency', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const agencyPromise = api.customer('SYNC').agency()
      .fetch()
      .then((agency) => {
        // eslint-disable-next-line no-param-reassign
        agency.agency_fare_url = 'https://www.syncromatics.com/fare-information';
        return agency.update();
      });

    return agencyPromise;
  });
});
