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

  it('should reuse its RealTimeClient when creating an CallStatesRealTimeContext', () => {
    const result = factory.callStates();
    result.realTimeClient.should.equal(realTimeClient);
  });

  it('should reuse its RealTimeClient when creating a DispatchMessagesRealTimeContext', () => {
    const result = factory.dispatchMessages();
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
