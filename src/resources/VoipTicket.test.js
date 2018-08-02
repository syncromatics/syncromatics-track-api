import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import VoipTicket from './VoipTicket';
import { voipTickets as mockVoipTickets } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a VoIP ticket based on a customer', () => {
  const client = new Client();
  const voipTicket = new VoipTicket(client, VoipTicket.makeHref('SYNC'));

  it('should set the href', () => voipTicket.href.should.equal('/1/SYNC/voip_ticket'));
  it('should not be hydrated', () => voipTicket.hydrated.should.equal(false));
});

describe('When instantiating a VoIP ticket based on an object', () => {
  const client = new Client();
  const voipTicket = new VoipTicket(client, {
    href: '/1/SYNC/voip_ticket',
    expiration: '2017-06-12T08:00:00-08:00',
    ticket: 'ticket',
    application_key: 'application key',
  });

  it('should set the href', () => voipTicket.href.should.equal('/1/SYNC/voip_ticket'));
  it('should be hydrated', () => voipTicket.hydrated.should.equal(true));
});

describe('When fetching a VoIP ticket based on a customer', () => {
  const client = new Client();
  beforeEach(() => mockVoipTickets.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new VoipTicket(client, VoipTicket.makeHref('SYNC')).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the expiration', () => promise.then(v => v.expiration).should.eventually.equal('2017-06-12T08:00:00-08:00'));
  it('should set the ticket', () => promise.then(v => v.ticket).should.eventually.equal('ticket'));
  it('should set the application key', () => promise.then(v => v.application_key).should.eventually.equal('application key'));
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/voip_ticket'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});
