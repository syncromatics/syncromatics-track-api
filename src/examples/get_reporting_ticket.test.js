import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, reportingTickets as mockReportingTickets } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When retrieving a reporting ticket for a customer', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockReportingTickets.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a fresh reporting ticket', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const reportingTicketPromise = api.customer('SYNC').reportingTicket()
      .fetch()
      .then(reportingTicket => reportingTicket); // do something with reportingTicket

    return reportingTicketPromise;
  });
});
