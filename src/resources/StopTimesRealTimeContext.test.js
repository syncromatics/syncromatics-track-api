import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import StopTimesRealTimeContext from './StopTimesRealTimeContext';
import RealTimeClient from '../RealTimeClient';
import { realTime as mock } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When creating a subscription for Stop Times', () => {
  const entity = 'STOPTIMES';
  const customerCode = 'SYNC';
  const emptyFilters = {
    stops: [],
    trips: [],
    vehicles: [],
  };

  it('can add filters for a single vehicle', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new StopTimesRealTimeContext(realTimeClient, customerCode);

    const vehicleHref = '123';
    const expectedFilters = {
      ...emptyFilters,
      vehicles: [vehicleHref],
    };
    subject.forVehicle(vehicleHref).on('update', () => { });

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('can add filters for an array of vehicles', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new StopTimesRealTimeContext(realTimeClient, customerCode);

    const vehicleHrefs = ['123', '456', '489'];
    const expectedFilters = {
      ...emptyFilters,
      vehicles: vehicleHrefs,
    };

    subject.forVehicles(vehicleHrefs).on('update', () => { });

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('can add filters for a single trip', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new StopTimesRealTimeContext(realTimeClient, customerCode);

    const trip = '123';
    const expectedFilters = {
      ...emptyFilters,
      trips: [trip],
    };
    subject.forTrip(trip).on('update', () => { });

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('can add filters for an array of trips', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new StopTimesRealTimeContext(realTimeClient, customerCode);

    const trips = ['123', '456', '489'];
    const expectedFilters = {
      ...emptyFilters,
      trips,
    };

    subject.forTrips(trips).on('update', () => { });

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('can add filters for a single stop', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new StopTimesRealTimeContext(realTimeClient, customerCode);

    const stop = '123';
    const expectedFilters = {
      ...emptyFilters,
      stops: [stop],
    };
    subject.forStop(stop).on('update', () => { });

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('can add filters for an array of stops', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new StopTimesRealTimeContext(realTimeClient, customerCode);

    const stops = ['123', '456', '489'];
    const expectedFilters = {
      ...emptyFilters,
      stops,
    };

    subject.forStops(stops).on('update', () => { });

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });

  it('can add filters for a single stop and multiple vehicles', () => {
    const server = mock.getServer();
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    const subject = new StopTimesRealTimeContext(realTimeClient, customerCode);

    const stop = 'abc';
    const vehicles = ['123', '456', '489'];
    const expectedFilters = {
      ...emptyFilters,
      stops: [stop],
      vehicles,
    };

    subject
      .forStop(stop)
      .forVehicles(vehicles)
      .on('update', () => { });

    const options = { closeConnection: true, realTimeClient };
    return server.verifySubscription(entity, options)
      .should.eventually.become(expectedFilters);
  });
});
