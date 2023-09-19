// import chai from 'chai';
// import chaiAsPromised from 'chai-as-promised';
// import fetchMock from 'fetch-mock';
// import Client from '../Client';
// import TripCancelationsContext from './TripCancelationsContext';
// import { tripCancelations as mockTripCancelations } from '../mocks';
//
// chai.should();
// chai.use(chaiAsPromised);
//
// describe('When building a query for trip cancelations', () => {
//   const client = new Client();
//   client.setAuthenticated();
//
//   beforeEach(() => fetchMock
//     .get(client.resolve('/1/SYNC/serviceadjustments/cancelations'), mockTripCancelations.list)
//     .catch(503));
//   afterEach(fetchMock.restore);
//
//   let promise;
//   beforeEach(() => {
//     const tripCancelations = new TripCancelationsContext(client, 'SYNC');
//     promise = tripCancelations.get();
//   });
//
//   it('should make the expected request', () => promise.should.be.fulfilled);
// });
