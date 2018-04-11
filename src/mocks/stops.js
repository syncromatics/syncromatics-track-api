// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const stops = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(stops.list), {
        headers: {
          Link: '</1/SYNC/stops?page=1&per_page=10&q=1st&sort=>; rel="next", </1/SYNC/stops?page=1&per_page=10&q=1st&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(stops.getById(1)));
    const postResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/stops/1',
      },
    });
    const putResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/stops/1',
      },
    });

    fetchMock
      .get(client.resolve('/1/SYNC/stops?page=1&per_page=10&q=1st&sort='), listResponse)
      .get(client.resolve('/1/SYNC/stops/1'), singleResponse)
      .post(client.resolve('/1/SYNC/stops'), postResponse)
      .put(client.resolve('/1/SYNC/stops/1'), putResponse);
  },
  getById: id => stops.list.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/stops/1',
    id: 1,
    name: '1st/Main',
    latitude: 34.081728,
    longitude: -118.351585,
  }],
};

export default stops;
