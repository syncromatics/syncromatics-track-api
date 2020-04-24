// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const signs = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(signs.list), {
        headers: {
          Link: '</1/SYNC/signs?page=1&per_page=10&q=first&sort=>; rel="next", </1/SYNC/signs?page=1&per_page=10&q=first&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(signs.getById(1)));
    const patchResponse = () => new Response(undefined, {
      headers: {},
    });

    fetchMock
      .get(client.resolve('/1/SYNC/signs?page=1&per_page=10&q=first&sort='), listResponse)
      .get(client.resolve('/1/SYNC/signs/1'), singleResponse)
      .patch(client.resolve('/1/SYNC/signs/1'), patchResponse);
  },
  getById: id => signs.list.find(v => v.id === id),
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

export default signs;
