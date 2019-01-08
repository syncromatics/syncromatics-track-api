// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const areas = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(areas.list), {
        headers: {
          Link: '</1/SYNC/areas?page=1&per_page=10&sort=>; rel="next", </1/SYNC/areas?page=1&per_page=10&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(areas.getById(1)));

    fetchMock
      .get(client.resolve('/1/SYNC/areas?page=1&per_page=10&sort='), listResponse)
      .get(client.resolve('/1/SYNC/areas/1'), singleResponse);
  },
  getById: id => areas.list.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/areas/1',
    id: 1,
    name: 'South Yard',
    encoded_polygon: 'crneFnwljVa...',
    area_type: 'Yard',
  }],
};

export default areas;
