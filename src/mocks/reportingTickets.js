// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const reportingTickets = {
  setUpSuccessfulMock: (client) => {
    const singleResponse = () => new Response(Client.toBlob({
      sso_provider: 'syncromatics.com',
      encrypted_claims_message_lines: [
        '-----BEGIN PGP MESSAGE-----',
        '-----END PGP MESSAGE-----',
      ],
    }));

    fetchMock
      .post(client.resolve('/1/SYNC/reporting_ticket'), singleResponse);
  },
};

export default reportingTickets;
