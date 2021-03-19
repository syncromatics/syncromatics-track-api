import RealTimeContextFactory from './RealTimeContextFactory';
import Resource from './Resource';
import Agency from './Agency';
import Area from './Area';
import AreasContext from './AreasContext';
import Asset from './Asset';
import AssetsContext from './AssetsContext';
import Assignment from './Assignment';
import Block from './Block';
import CustomerUsersContext from './CustomerUsersContext';
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
import EnplugScreenshot from './EnplugScreenshot';
import EnplugConfiguration from './EnplugConfiguration';
import Message from './Message';
import MessagesContext from './MessagesContext';
import MessageChannels from './MessageChannels';
import DispatchMessageStatus from './DispatchMessageStatus';
import Pattern from './Pattern';
import PatternsContext from './PatternsContext';
import ReportingTicket from './ReportingTicket';
import Route from './Route';
import RoutesContext from './RoutesContext';
import Run from './Run';
import Service from './Service';
import ServicePackage from './ServicePackage';
import ServicePackagesContext from './ServicePackagesContext';
import Settings from './Settings';
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

/**
 * Customer resource
 *
 * This acts as the context for accessing all customer-specific data.
 */
class Customer extends Resource {
  /**
   * Creates a new resource
   * @param {Client} client Instance of pre-configured client
   * @param {RealTimeClient} realTimeClient Instance of pre-configured realtime client
   * @param {string} customerCode Customer code
   */
  constructor(client, realTimeClient, customerCode) {
    super(client);
    this.realTimeClient = realTimeClient;

    /**
     * Customer code
     * @instance
     */
    this.code = customerCode;
  }

  /**
   * Gets a context for receiving realtime updates for this customer's data.
   * @returns {RealTimeContext} Context for receiving realtime updates for this customer's data.
   */
  realTime() {
    return new RealTimeContextFactory(this.realTimeClient, this.code);
  }

  /**
   * Gets the single agency record associated with this customer
   * @param {Object} [payload={}] Optional values with which to initialize this agency.
   * @returns {Agency} Agency resource
   */
  agency(payload = {}) {
    return this.resource(Agency, Agency.makeHref(this.code), payload);
  }

  /**
   * Gets an area resource by id
   * @param {Number} id Identity of the area
   * @returns {Area} Area resource
   */
  area(id) {
    return this.resource(Area, Area.makeHref(this.code, id));
  }

  /**
   * Gets a context for querying this customer's areas
   * @returns {AreasContext} Context for querying this customer's areas
   */
  areas() {
    return this.resource(AreasContext, this.code);
  }

  /**
   * Gets an asset resource by id
   * @param {Object} payload Identity of the asset or object representing a new call
   * @returns {Asset} Asset resource
   */
  asset(payload) {
    if (!isNaN(parseFloat(payload)) && isFinite(payload)) {
      return this.resource(Asset, Asset.makeHref(this.code, payload));
    }
    return this.resource(Asset, { code: this.code, ...payload });
  }

  /**
   * Gets a context for querying this customer's assets
   * @returns {AssetsContext} Context for querying this customer's assets
   */
  assets() {
    return this.resource(AssetsContext, this.code);
  }

  /**
   * Gets a assignment resource by vehicle id
   * @param {Number} id Identity of the vehicle
   * @returns {Assignment} Assignment resource
   */
  assignment(id) {
    return this.resource(Assignment, Assignment.makeHref(this.code, id));
  }

  /**
   * Gets a block resource by id
   * @param {Number} id Identity of the block
   * @returns {Block} Block resource
   */
  block(id) {
    return this.resource(Block, Block.makeHref(this.code, id));
  }

  /**
   * Gets a call resource by id
   * @param {Object} payload Identity of the call or object representing a new call
   * @returns {Message} Call resource
   */
  call(payload) {
    if (!isNaN(parseFloat(payload)) && isFinite(payload)) {
      return this.resource(Call, Call.makeHref(this.code, payload));
    }
    return this.resource(Call, { code: this.code, ...payload });
  }

  /**
   * Gets a callParticipant resource by id
   * @param {Number} callId ID of the call
   * @param {Object} payload Identify of an existing or object representing a new call participant.
   * @returns {CallParticipant} Call participant resource
   */
  callParticipant(callId, payload) {
    if (!isNaN(parseFloat(payload)) && isFinite(payload)) {
      const newProperties = CallParticipant.makeHref(this.code, callId, payload);
      return this.resource(CallParticipant, { callId, ...newProperties });
    }
    return this.resource(CallParticipant, { code: this.code, callId, ...payload });
  }

  /**
   * Gets a context for querying this customer's dispatch messages
   * @returns {DispatchMessagesContext} Context for querying this customer's dispatch messages
   */
  dispatchMessages() {
    return this.resource(DispatchMessagesContext, this.code);
  }

  /**
   * Gets a dispatch message resource by id
   * @param {Number} id  Identity of the dispatch message
   * @returns {DispatchMessage} Dispatch Message resource
   */
  dispatchMessage(id) {
    return this.resource(DispatchMessage, DispatchMessage.makeHref(this.code, id));
  }

  /**
   * Gets a dispatch message batch resource by id
   * @param {string} id Alphanumeric ID of the dispatch message batch
   * @return {DispatchMessageBatch} Dispatch Message Batch resource
   */
  dispatchMessageBatch(id) {
    return this.resource(DispatchMessageBatch, DispatchMessageBatch.makeHref(this.code, id));
  }

  /**
   * Gets a dispatch message status resource
      * @returns {DispatchMessageStatus} Dispatch Message Status resource
   */
  dispatchMessageStatus() {
    return this.resource(DispatchMessageStatus, DispatchMessageStatus.makeHref(this.code));
  }

  /**
   * Gets a context for querying this customer's drivers
   * @returns {DriversContext} Context for querying this customer's drivers
   */
  drivers() {
    return this.resource(DriversContext, this.code);
  }

  /**
   * Gets a driver resource by id
   * @param {Number} id Identity of the driver
   * @returns {Driver} Driver resource
   */
  driver(id) {
    return this.resource(Driver, Driver.makeHref(this.code, id));
  }

  /**
   * Gets an enplug screenshot by id
   * @param {String} serial Serial of the Enplug device
   * @returns {EnplugScreenshot} EnplugScreenshot resource
   */
  enplugScreenshot(serial) {
    return this.resource(EnplugScreenshot, EnplugScreenshot.makeHref(this.code, serial));
  }

  /**
   * Gets an enplug configuration for customer with fields
   * @param {Object} [configOptions] Values for this enplug configuration.
   * @returns {EnplugConfiguration} EnplugConfiguration resource
   */
  enplugConfiguration(configOptions) {
    const options = {
      ...EnplugConfiguration.makeHref(this.code, configOptions.deviceSerial),
      ...configOptions,
    };
    return this.resource(EnplugConfiguration, options);
  }

  /**
   * Gets a context for querying this customer's external APIs
   * @returns {ExternalApisContext} Context for querying this customer's external APIs
   */
  externalApis() {
    return this.resource(ExternalApisContext, this.code);
  }

  /**
   * Gets an external API resource by id
   * @param {Number} id Identity of the external API
   * @returns {ExternalApi} ExternalApi resource
   */
  externalApi(id) {
    return this.resource(ExternalApi, ExternalApi.makeHref(this.code, id));
  }

  /**
   * Gets an incident resource by id
   * @param {Number} id Identity of the incident
   * @returns {Incident} Incident resource
   */
  incident(id) {
    return this.resource(Incident, Incident.makeHref(this.code, id));
  }

  /**
   * Gets a customers available message channels by its code.
   * @returns {MessageChannels} for fetching this customer's message channels
   */
  messageChannels() {
    return this.resource(MessageChannels, MessageChannels.makeHref(this.code));
  }

  /**
   * Gets a context for querying this customer's messages
   * @returns {MessagesContext} Context for querying this customer's messages
   */
  messages() {
    return this.resource(MessagesContext, this.code);
  }

  /**
   * Gets a message resource by id
   * @param {Object} payload Identity of the message or object representing a new message
   * @returns {Message} Message resource
   */
  message(payload) {
    if (!isNaN(parseFloat(payload)) && isFinite(payload)) {
      return this.resource(Message, Message.makeHref(this.code, payload));
    }
    return this.resource(Message, { code: this.code, ...payload });
  }

  /**
   * Gets a reporting ticket resource
   * @returns {ReportingTicket} ReportingTicket resource
   */
  reportingTicket() {
    return this.resource(ReportingTicket, ReportingTicket.makeHref(this.code));
  }

  /**
   * Gets a context for querying this customer's routes
   * @returns {RoutesContext} Context for querying this customer's routes
   */
  routes() {
    return this.resource(RoutesContext, this.code);
  }

  /**
   * Gets a route resource by id
   * @param {Number} id Identity of the route
   * @returns {Route} Route resource
   */
  route(id) {
    return this.resource(Route, Route.makeHref(this.code, id));
  }

  /**
   * Gets a context for querying this customer's patterns
   * @returns {PatternsContext} Context for querying this customer's patterns
   */
  patterns() {
    return this.resource(PatternsContext, this.code);
  }

  /**
   * Gets a pattern resource by id
   * @param {Number} id Identity of the pattern
   * @returns {Pattern} Pattern resource
   */
  pattern(id) {
    return this.resource(Pattern, Pattern.makeHref(this.code, id));
  }

  /**
   * Gets a Run resource by ID
   * @param {Number} id Identity of the run
   * @returns {Run} Run resource
   */
  run(id) {
    return this.resource(Run, Run.makeHref(this.code, id));
  }

  /**
   * Gets a context for querying this customer's service packages
   * @returns {ServicePackagesContext} Context for querying this customer's service packages
   */
  servicePackages() {
    return this.resource(ServicePackagesContext, this.code);
  }

  /**
   * Gets a Service Package resource by ID
   * @param {Number} id Identity of the service package
   * @returns {ServicePackage} ServicePackage resource
   */
  servicePackage(id) {
    return this.resource(ServicePackage, ServicePackage.makeHref(this.code, id));
  }

  /**
   * Gets a Service resource by ID
   * @param {Number} id Identity of the service
   * @returns {Service} Service resource
   */
  service(id) {
    return this.resource(Service, Service.makeHref(this.code, id));
  }

  /**
   * Gets a customer's settings resource by its code
   * @returns {Settings} Settings resource
   */
  settings() {
    return this.resource(Settings, Settings.makeHref(this.code));
  }

  /**
   * Gets a context for querying this customer's signs
   * @returns {SignsContext} Context for querying this customer's signs
   */
  signs() {
    return this.resource(SignsContext, this.code);
  }

  /**
   * Gets a sign resource by id
   * @param {Number} id Identity of the sign
   * @returns {Sign} Sign resource
   */
  sign(id) {
    return this.resource(Sign, Sign.makeHref(this.code, id));
  }

  /**
   * Gets a context for querying this customer's stops
   * @returns {StopsContext} Context for querying this customer's stops
   */
  stops() {
    return this.resource(StopsContext, this.code);
  }

  /**
   * Gets a stop resource by id
   * @param {Number} id Identity of the stop
   * @returns {Stop} Stop resource
   */
  stop(id) {
    return this.resource(Stop, Stop.makeHref(this.code, id));
  }

  /**
   * Gets a context for querying this customer's tags
   * @returns {TagContext} Context for querying this customer's tags
   */
  tags() {
    return this.resource(TagsContext, this.code);
  }

  /**
   * Gets a tag resource by id
   * @param {Object} id Identity of the tag or the new object
   * @returns {Tag} Tag resource
   */
  tag(id) {
    if (!isNaN(parseFloat(id)) && isFinite(id)) {
      return this.resource(Tag, Tag.makeHref(this.code, id));
    }
    return this.resource(Tag, { code: this.code, ...id });
  }

  /**
   * Gets a trip resource by id
   * @param {Number} id Identity of the trip
   * @returns {Trip} Trip resource
   */
  trip(id) {
    return this.resource(Trip, Trip.makeHref(this.code, id));
  }

  /**
   * Gets a TwitterOAuth resource
   * @returns {TwitterOAuth} TwitterOAuth resource
   */
  twitterOAuth() {
    return this.resource(TwitterOAuth, TwitterOAuth.makeHref(this.code));
  }

  /**
   * Gets a TwitterOAuthRequest resource
   * @returns {TwitterOAuthRequest} TwitterOAuthRequest resource
   */
  twitterOAuthRequest() {
    return this.resource(TwitterOAuthRequest, TwitterOAuthRequest.makeHref(this.code));
  }

  /**
   * Gets a TwitterUsername resource
   * @returns {TwitterUsername} TwitterUsername resource
   */
  twitterUsername() {
    return this.resource(TwitterUsername, TwitterUsername.makeHref(this.code));
  }

  /**
   * Gets a context for querying users that have access to this customer.
   * Note that returned users might also have access to other customers,
   * and other users that do not have access to this customer might not
   * be returned.
   * @returns {UserContext} Context for querying this customer's users
   */
  users() {
    return this.resource(CustomerUsersContext, this.code);
  }

  /**
   * Gets a context for querying this customer's vehicles
   * @returns {VehiclesContext} Context for querying this customer's vehicles
   */
  vehicles() {
    return this.resource(VehiclesContext, this.code);
  }

  /**
   * Gets a vehicle resource by id
   * @param {Number} id Identity of the vehicle
   * @returns {Vehicle} Vehicle resource
   */
  vehicle(id) {
    return this.resource(Vehicle, Vehicle.makeHref(this.code, id));
  }

  /**
   * Gets a voip ticket resource
   * @returns {VoipTicket} VoipTicket resource
   */
  voipTicket() {
    return this.resource(VoipTicket, VoipTicket.makeHref(this.code));
  }
}

export default Customer;
