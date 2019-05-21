import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import ReportingTicket from './ReportingTicket';
import { reportingTickets as mockReportingTickets } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a reporting ticket based on a customer', () => {
  const client = new Client();
  const reportingTicket = new ReportingTicket(client, ReportingTicket.makeHref('SYNC'));

  it('should set the href', () => reportingTicket.href.should.equal('/1/SYNC/reporting_ticket'));
  it('should not be hydrated', () => reportingTicket.hydrated.should.equal(false));
});

describe('When instantiating a reporting ticket based on an object', () => {
  const client = new Client();
  const reportingTicket = new ReportingTicket(client, {
    sso_provider: 'syncromatics.com',
    encrypted_claims_message_lines: [
      '-----BEGIN PGP MESSAGE-----',
      '-----END PGP MESSAGE-----',
    ],
  });

  it('should be hydrated', () => reportingTicket.hydrated.should.equal(true));
});

describe('When fetching a reporting ticket based on a customer', () => {
  const client = new Client();
  beforeEach(() => mockReportingTickets.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new ReportingTicket(client, ReportingTicket.makeHref('SYNC')).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the SSO provider', () => promise.then(v => v.sso_provider).should.eventually.equal('syncromatics.com'));
  it('should set the encryped claims message lines', () => promise.then(v => v.encrypted_claims_message_lines)
    .should.eventually.include('-----BEGIN PGP MESSAGE-----')
    .and.include('-----END PGP MESSAGE-----'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});
