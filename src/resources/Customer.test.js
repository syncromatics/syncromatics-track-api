import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Client from '../Client';
import Customer from './Customer';
import CustomerUsersContext from './CustomerUsersContext';
import RealTimeClient from '../RealTimeClient';
import Agency from './Agency';
import Area from './Area';
import AreasContext from './AreasContext';
import Block from './Block';
import Call from './Call';
import CallParticipant from './CallParticipant';
import DispatchMessage from './DispatchMessage';
import DispatchMessagesContext from './DispatchMessagesContext';
import DispatchMessageBatch from './DispatchMessageBatch';
import Driver from './Driver';
import DriversContext from './DriversContext';
import ExternalApi from './ExternalApi';
import ExternalApisContext from './ExternalApisContext';
import Incident from './Incident';
import Message from './Message';
import MessagesContext from './MessagesContext';
import Pattern from './Pattern';
import PatternsContext from './PatternsContext';
import RiderAppConfiguration from './RiderAppConfiguration';
import ReportingTicket from './ReportingTicket';
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
import TagsContext from './TagsContext';
import Trip from './Trip';
import TwitterOAuth from './TwitterOAuth';
import TwitterOAuthRequest from './TwitterOAuthRequest';
import TwitterUsername from './TwitterUsername';
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
  it('should allow an area to be retrieved', () => customer.area().should.be.instanceOf(Area));
  it('should allow a list of areas to be retrieved', () => customer.areas().should.be.instanceOf(AreasContext));
  it('should allow an assignment to be retrieved', () => customer.assignment().should.be.instanceOf(Assignment));
  it('should allow a block to be retrieved', () => customer.block().should.be.instanceof(Block));
  it('should allow a call to be retrieved', () => customer.call().should.be.instanceOf(Call));
  it('should allow a call participant to be retrieved', () => customer.callParticipant().should.be.instanceOf(CallParticipant));
  it('should allow dispatch messages to be searched', () => customer.dispatchMessages().should.be.instanceOf(DispatchMessagesContext));
  it('should allow a dispatch message to be retrieved', () => customer.dispatchMessage().should.be.instanceOf(DispatchMessage));
  it('should allow a dispatch message batch to be retrieved', () => customer.dispatchMessageBatch().should.be.instanceOf(DispatchMessageBatch));
  it('should allow drivers to be searched', () => customer.drivers().should.be.instanceOf(DriversContext));
  it('should allow a driver to be retrieved', () => customer.driver().should.be.instanceOf(Driver));
  it('should allow external apis to be searched', () => customer.externalApis().should.be.instanceOf(ExternalApisContext));
  it('should allow an external api to be retrieved', () => customer.externalApi().should.be.instanceOf(ExternalApi));
  it('should allow an incident to be retrieved', () => customer.incident().should.be.instanceOf(Incident));
  it('should allow messages to be searched', () => customer.messages().should.be.instanceof(MessagesContext));
  it('should allow a message to be retrieved', () => customer.message().should.be.instanceof(Message));
  it('should allow patterns to be searched', () => customer.patterns().should.be.instanceof(PatternsContext));
  it('should allow a pattern to be retrieved', () => customer.pattern().should.be.instanceof(Pattern));
  it('should allow a rider app configuration to be retrieved', () => customer.riderAppConfiguration().should.be.instanceOf(RiderAppConfiguration));
  it('should allow a reporting ticket to be retrieved', () => customer.reportingTicket().should.be.instanceof(ReportingTicket));
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
  it('should allow a twitter oauth token to be created', () => customer.twitterOAuth().should.be.instanceof(TwitterOAuth));
  it('should allow a twitter oauth request token to be created', () => customer.twitterOAuthRequest().should.be.instanceof(TwitterOAuthRequest));
  it('should allow a twitter username to be retrieved', () => customer.twitterUsername().should.be.instanceof(TwitterUsername));
  it('should allow users to be searched', () => customer.users().should.be.instanceOf(CustomerUsersContext));
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
