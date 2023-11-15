// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const tripCancelationBatches = {
  setUpSuccessfulMock: (client) => {
    const fetchResponse = () => new Response(Client.toBlob(tripCancelationBatches.response));
    const createResponse = () => new Response(Client.toBlob(tripCancelationBatches.response));

    fetchMock
      .get(client.resolve('/1/SYNC/serviceadjustments/tripcancelations'), fetchResponse)
      .post(client.resolve('/1/SYNC/serviceadjustments/tripcancelations'), createResponse);
  },
  response: {
    cancelations: [
      { href: '/1/SYNC/serviceadjustments/tripcancelations/1' },
      { href: '/1/SYNC/serviceadjustments/tripcancelations/2' },
    ],
  },
};

export default tripCancelationBatches;
