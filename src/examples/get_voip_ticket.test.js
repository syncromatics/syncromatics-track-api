import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, voipTickets as mockVoipTickets } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When retrieving a VoIP ticket for a customer', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockVoipTickets.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a fresh VoIP ticket', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const voipTicketPromise = api.customer('SYNC').voipTicket()
      .fetch()
      .then(voipTicket => voipTicket); // do something with voipTicket

    return voipTicketPromise;
  });
});
