import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Client from '../Client';
import RealTimeClient from '../RealTimeClient';
import RealTimeContextFactory from './RealTimeContextFactory';

chai.should();
chai.use(chaiAsPromised);

describe('When creating a RealTimeContext', () => {
  const customerCode = 'SYNC';
  const client = new Client();
  const realTimeClient = new RealTimeClient(client);
  const factory = new RealTimeContextFactory(realTimeClient, customerCode);

  it('should reuse its RealTimeClient when creating an AreasRealTimeContext', () => {
    const result = factory.areas();
    result.realTimeClient.should.equal(realTimeClient);
  });

  it('should reuse its RealTimeClient when creating an AssignmentsRealTimeContext', () => {
    const result = factory.assignments();
    result.realTimeClient.should.equal(realTimeClient);
  });

  it('should reuse its RealTimeClient when creating an BikeRackSlotsRealTimeContext', () => {
    const result = factory.bikeRackSlots();
    result.realTimeClient.should.equal(realTimeClient);
  });

  it('should reuse its RealTimeClient when creating an TripCancelationsRealtimeContext', () => {
    const result = factory.tripCancelations();
    result.realTimeClient.should.equal(realTimeClient);
  });

  it('should reuse its RealTimeClient when creating an CallStatesRealTimeContext', () => {
    const result = factory.callStates();
    result.realTimeClient.should.equal(realTimeClient);
  });

  it('should reuse its RealTimeClient when creating a DispatchMessagesRealTimeContext', () => {
    const result = factory.dispatchMessages();
    result.realTimeClient.should.equal(realTimeClient);
  });

  it('should reuse its RealTimeClient when creating a IncidentsRealTimeContext', () => {
    const result = factory.incidents();
    result.realTimeClient.should.equal(realTimeClient);
  });

  it('should reuse its RealTimeClient when creating a SignsRealTimeContext', () => {
    const result = factory.signs();
    result.realTimeClient.should.equal(realTimeClient);
  });

  it('should reuse its RealTimeClient when creating a StopTimesRealTimeContext', () => {
    const result = factory.stopTimes();
    result.realTimeClient.should.equal(realTimeClient);
  });

  it('should reuse its RealTimeClient when creating a VehiclesRealTimeContext', () => {
    const result = factory.vehicles();
    result.realTimeClient.should.equal(realTimeClient);
  });

  it('should reuse its RealTimeClient when creating a VoipHeartbeatHandler', () => {
    const result = factory.voip();
    result.realTimeClient.should.equal(realTimeClient);
  });
});

describe('When attaching disconnect and reconnect handlers', () => {
  const customerCode = 'SYNC';

  it('should attach disconnect handlers to the realTimeClient', () => {
    const disconnectHandler = () => {};
    let verifyCallback;
    const didVerifyCallback = new Promise((resolve) => {
      verifyCallback = resolve;
    });
    const realTimeClientMock = {
      addEventListener: (event, handler) => {
        if (event === 'disconnect' && handler === disconnectHandler) {
          verifyCallback(true);
        }
      },
    };
    const factory = new RealTimeContextFactory(realTimeClientMock, customerCode);

    factory.onDisconnect(disconnectHandler);
    didVerifyCallback.should.become(true);
  });

  it('should remove disconnect handlers', () => {
    const disconnectHandler = () => {};
    let verifyCallback;
    const didVerifyCallback = new Promise((resolve) => {
      verifyCallback = resolve;
    });
    const realTimeClientMock = {
      addEventListener: () => {},
      removeEventListener: (event, handler) => {
        if (event === 'disconnect' && handler === disconnectHandler) {
          verifyCallback(true);
        }
      },
    };
    const factory = new RealTimeContextFactory(realTimeClientMock, customerCode);

    const handlerRemover = factory.onDisconnect(disconnectHandler);
    handlerRemover();
    didVerifyCallback.should.become(true);
  });

  it('should fire reconnect handlers', () => {
    const reconnectHandler = () => {};
    let verifyCallback;
    const didVerifyCallback = new Promise((resolve) => {
      verifyCallback = resolve;
    });
    const realTimeClientMock = {
      addEventListener: (event, handler) => {
        if (event === 'reconnect' && handler === reconnectHandler) {
          verifyCallback(true);
        }
      },
    };
    const factory = new RealTimeContextFactory(realTimeClientMock, customerCode);

    factory.onReconnect(reconnectHandler);
    didVerifyCallback.should.become(true);
  });

  it('should remove reconnect handlers', () => {
    const reconnectHandler = () => {};
    let verifyCallback;
    const didVerifyCallback = new Promise((resolve) => {
      verifyCallback = resolve;
    });
    const realTimeClientMock = {
      addEventListener: () => {},
      removeEventListener: (event, handler) => {
        if (event === 'reconnect' && handler === reconnectHandler) {
          verifyCallback(true);
        }
      },
    };
    const factory = new RealTimeContextFactory(realTimeClientMock, customerCode);

    const handlerRemover = factory.onReconnect(reconnectHandler);
    handlerRemover();
    didVerifyCallback.should.become(true);
  });
});
