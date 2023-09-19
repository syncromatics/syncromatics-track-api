// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const tripCancelations = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(tripCancelations.list), {
        headers: {
          Link: '</1/SYNC/serviceadjustments/cancelations>; rel="next", </1/SYNC/serviceadjustments/cancelations>; rel="last"',
        },
      });

    fetchMock
      .get(client.resolve('/1/SYNC/serviceadjustments/cancelations'), listResponse)
  },
  list: [{
    href: '/1/SYNC/signs/1',
    id: 1,
    name: 'The first sign',
    enabled: true,
    current_health: {
      last_check_in: '2017-01-01T00:00:00.000-0700',
      hardware_health: 'HardwareError',
      hardware_error_info: 'Exception thrown',
      rssi: -34,
    },
  }],
};

export default tripCancelations;
