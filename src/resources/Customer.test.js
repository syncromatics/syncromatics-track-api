import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Client from '../Client';
import Customer from './Customer';
import RealTimeClient from '../RealTimeClient';
import Agency from './Agency';
import Block from './Block';
import DispatchMessage from './DispatchMessage';
import DispatchMessagesContext from './DispatchMessagesContext';
import DispatchMessageBatch from './DispatchMessageBatch';
import Driver from './Driver';
import DriversContext from './DriversContext';
import ExternalApi from './ExternalApi';
import ExternalApisContext from './ExternalApisContext';
import MessageTemplate from './MessageTemplate';
import MessageTemplatesContext from './MessageTemplatesContext';
import Pattern from './Pattern';
import PatternsContext from './PatternsContext';
import Route from './Route';
import RoutesContext from './RoutesContext';
import Run from './Run';
import Service from './Service';
import ServicePackage from './ServicePackage';
import ServicePackagesContext from './ServicePackagesContext';
import Sign from './Sign';
import SignsContext from './SignsContext';
import Stop from './Stop';
import StopsContext from './StopsContext';
import Tag from './Tag';
import Trip from './Trip';
import TagsContext from './TagsContext';
import Vehicle from './Vehicle';
import VehiclesContext from './VehiclesContext';
import VoipTicket from './VoipTicket';
import Assignment from './Assignment';

chai.should();
chai.use(chaiAsPromised);

describe('When getting resources related to a customer', () => {
  const client = new Client();
  const realTimeClient = new RealTimeClient(client);
  const customer = new Customer(client, realTimeClient, 'SYNC');

  it('should allow the agency record to be retrieved', () => customer.agency().should.be.instanceOf(Agency));
  it('should allow an assignment to be retrieved', () => customer.assignment().should.be.instanceOf(Assignment));
  it('should allow a block to be retrieved', () => customer.block().should.be.instanceof(Block));
  it('should allow dispatch messages to be searched', () => customer.dispatchMessages().should.be.instanceOf(DispatchMessagesContext));
  it('should allow a dispatch message to be retrieved', () => customer.dispatchMessage().should.be.instanceOf(DispatchMessage));
  it('should allow a dispatch message batch to be retrieved', () => customer.dispatchMessageBatch().should.be.instanceOf(DispatchMessageBatch));
  it('should allow drivers to be searched', () => customer.drivers().should.be.instanceOf(DriversContext));
  it('should allow a driver to be retrieved', () => customer.driver().should.be.instanceOf(Driver));
  it('should allow external apis to be searched', () => customer.externalApis().should.be.instanceOf(ExternalApisContext));
  it('should allow an external api to be retrieved', () => customer.externalApi().should.be.instanceOf(ExternalApi));
  it('should allow message templates to be searched', () => customer.messageTemplates().should.be.instanceof(MessageTemplatesContext));
  it('should allow a message template to be retrieved', () => customer.messageTemplate().should.be.instanceof(MessageTemplate));
  it('should allow patterns to be searched', () => customer.patterns().should.be.instanceof(PatternsContext));
  it('should allow a pattern to be retrieved', () => customer.pattern().should.be.instanceof(Pattern));
  it('should allow routes to be searched', () => customer.routes().should.be.instanceof(RoutesContext));
  it('should allow a route to be retrieved', () => customer.route().should.be.instanceof(Route));
  it('should allow a run to be retrieved', () => customer.run().should.be.instanceof(Run));
  it('should allow a service to be retrieved', () => customer.service().should.be.instanceof(Service));
  it('should allow service packages to be searched', () => customer.servicePackages().should.be.instanceof(ServicePackagesContext));
  it('should allow a service package to be retrieved', () => customer.servicePackage().should.be.instanceof(ServicePackage));
  it('should allow signs to be searched', () => customer.signs().should.be.instanceof(SignsContext));
  it('should allow a sign to be retrieved', () => customer.sign().should.be.instanceof(Sign));
  it('should allow stops to be searched', () => customer.stops().should.be.instanceof(StopsContext));
  it('should allow a stop to be retrieved', () => customer.stop().should.be.instanceof(Stop));
  it('should allow tags to be searched', () => customer.tags().should.be.instanceof(TagsContext));
  it('should allow a tag to be retrieved', () => customer.tag().should.be.instanceof(Tag));
  it('should allow a trip to be retrieved', () => customer.trip().should.be.instanceof(Trip));
  it('should allow vehicles to be searched', () => customer.vehicles().should.be.instanceof(VehiclesContext));
  it('should allow a vehicle to be retrieved', () => customer.vehicle().should.be.instanceof(Vehicle));
  it('should allow a voip ticket to be retrieved', () => customer.voipTicket().should.be.instanceof(VoipTicket));
});

describe('When accessing a realTimeContext', () => {
  const client = new Client();
  const realTimeClient = new RealTimeClient(client);
  const customer = new Customer(client, realTimeClient, 'SYNC');

  it('should reuse its RealTimeClient', () => {
    const realTimeClient1 = customer.realTime().realTimeClient;
    const realTimeClient2 = customer.realTime().realTimeClient;
    const realTimeClient3 = customer.realTime().realTimeClient;
    realTimeClient1.should.equal(realTimeClient2);
    realTimeClient1.should.equal(realTimeClient3);
  });
});
