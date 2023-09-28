// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const tripCancelationBatches = {
  setUpSuccessfulMock: (client) => {
    const getResponse = () => new Response(Client.toBlob(tripCancelationBatches.list[0]));
    const postResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/serviceadjustments/cancelations',
      },
    });

    fetchMock
      .get(client.resolve('/1/SYNC/serviceadjustments/cancelations'), getResponse)
      .post(client.resolve('/1/SYNC/serviceadjustments/cancelations'), postResponse);
  },
  list: [{
    href: '/1/SYNC/serviceadjustments/cancelations',
    cancelations: [
      { href: '/1/SYNC/serviceadjustments/cancelation/1' },
      { href: '/1/SYNC/serviceadjustments/cancelation/2' },
    ],
  }],
};

export default tripCancelationBatches;
