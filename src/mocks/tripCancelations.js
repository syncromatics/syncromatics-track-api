// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const tripCancelations = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(tripCancelations.list), {
        headers: {
          Link: '</1/SYNC/serviceadjustments/cancelations?page=1&per_page=100&sort=>; rel="next", </1/SYNC/areas?page=1&per_page=100&sort=>; rel="last"'
        },
      });

    fetchMock
      .get(client.resolve('/1/SYNC/serviceadjustments/cancelations?page=1&per_page=100&sort='), listResponse)
  },
  list: [{
    href: '/1/SYNC/serviceadjustments/cancelation/1',
    tripId: 333,
    uncancel: false,
  },{
    href: '/1/SYNC/serviceadjustments/cancelation/2',
    tripId: 444,
    uncancel: true,
  }],
};

export default tripCancelations;
