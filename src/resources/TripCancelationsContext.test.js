import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import TripCancelationsContext from './TripCancelationsContext';
import { tripCancelations as mockTripCancelations } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When building a query for trip cancelations', () => {
  const client = new Client();
  client.setAuthenticated();

  beforeEach(() => fetchMock
    .get(client.resolve('/1/SYNC/serviceadjustments/cancelations?page=1&per_page=100&sort='), mockTripCancelations.list)
    .catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const tripCancelations = new TripCancelationsContext(client, 'SYNC');
    promise = tripCancelations
        .withPage(1)
        .withPerPage(100)
        .getPage();
  });

  it('should make the expected request', () => promise.should.be.fulfilled);
});

describe('When building a new trip cancelation', () => {
  const client = new Client();
  client.setAuthenticated();

  const newCancelations = [
    { tripId: mockTripCancelations.list[0].tripId, uncancel: mockTripCancelations.list[0].uncancel, },
    { tripId: mockTripCancelations.list[1].tripId, uncancel: mockTripCancelations.list[1].uncancel, },
  ];

  beforeEach(() => fetchMock
    .post(client.resolve('/1/SYNC/serviceadjustments/cancelations'), mockTripCancelations.list)
    .catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const tripCancelations = new TripCancelationsContext(client, 'SYNC');
    promise = tripCancelations.create(newCancelations);
  });

  it('should make the expected request', () => promise.should.be.fulfilled);
});