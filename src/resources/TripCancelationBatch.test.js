import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import TripCancelationBatch from './TripCancelationBatch';
import { tripCancelationBatches as mocks } from '../mocks';
import TripCancelations from "../mocks/tripCancelations";

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a trip cancelation batch based on customer and ID', () => {
  const client = new Client();
  const batch = new TripCancelationBatch(client, TripCancelationBatch.makeHref('SYNC', '90892e24-5279-4066-b109-a112925edb89'));
  it('should set the href', () => batch.href.should.equal('/1/SYNC/serviceadjustments/cancelations/batches/90892e24-5279-4066-b109-a112925edb89'));
  it('should not be hydrated', () => batch.hydrated.should.equal(false));
});

describe('When instantiating a trip cancelation batch based on an object', () => {
  const client = new Client();
  const batch = new TripCancelationBatch(client, mocks.getById('90892e24-5279-4066-b109-a112925edb89'));

  it('should set the ID', () => batch.id.should.equal('90892e24-5279-4066-b109-a112925edb89'));
  it('should set the href', () => batch.href.should.equal('/1/SYNC/serviceadjustments/cancelations/batches/90892e24-5279-4066-b109-a112925edb89'));
  it('should set the trip cancelations', () => batch.trip_cancelations.length.should.equal(2));
  it('should be hydrated', () => batch.hydrated.should.equal(true));
});

// describe('When fetching a trip cancelation batch based on customer and ID', () => {
//   const client = new Client();
//
//   beforeEach(() => mocks.setUpSuccessfulMock(client));
//   beforeEach(() => fetchMock.catch(503));
//   afterEach(fetchMock.restore);
//
//   let promise;
//   beforeEach(() => {
//     promise = new TripCancelationBatch(client, TripCancelationBatch.makeHref('SYNC', '90892e24-5279-4066-b109-a112925edb89')).fetch();
//   });
//
//   it('should resolve the promise', () => promise.should.be.fulfilled);
//   it('should set the ID', () => promise.then(x => x.id).should.eventually.equal('90892e24-5279-4066-b109-a112925edb89'));
//   it('should set the href', () => promise.then(x => x.href).should.eventually.equal('/1/SYNC/dispatch_messages/batches/90892e24-5279-4066-b109-a112925edb89'));
//   it('should set the trip cancelations', () => promise.then(x => x.dispatch_messages.length).should.eventually.equal(2));
//   it('should be hydrated', () => promise.then(x => x.hydrated).should.eventually.equal(true));
// });

// describe('When creating a trip cancelation batch', () => {
//   const client = new Client();
//
//   beforeEach(() => mocks.setUpSuccessfulMock(client));
//   beforeEach(() => fetchMock.catch(503));
//   afterEach(fetchMock.restore);
//
//   let promise;
//   beforeEach(() => {
//     promise = new TripCancelationBatch(client, { code: 'SYNC',
//       ...{
//         trip_cancelations: [
//           { href: '/1/SYNC/serviceadjustments/cancelations/1' },
//           { href: '/1/SYNC/serviceadjustments/cancelations/2' },
//         ],
//       },
//     }).create(TripCancelations);
//   });
//
//   it('should resolve the promise', () => promise.should.be.fulfilled);
//   it('should set the ID', () => promise.then(x => x.id).should.eventually.equal('90892e24-5279-4066-b109-a112925edb89'));
//   it('should set the href', () => promise.then(x => x.href).should.eventually.equal('/1/SYNC/serviceadjustments/cancelations/batches/90892e24-5279-4066-b109-a112925edb89'));
//   it('should set the message', () => promise.then(x => x.trip_cancelations.length).should.eventually.equal(2));
//   it('should be hydrated', () => promise.then(x => x.hydrated).should.eventually.equal(true));
// });
