// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const assignableStops = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(assignableStops.list), {
        headers: {
          Link: '</1/SYNC/assignable_entities/stops?page=1&per_page=10&sort=>; rel="next", </1/SYNC/assignable_entities/stops?page=1&per_page=10&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(assignableStops.getById('1st_and_main')));

    fetchMock
      .get(client.resolve('/1/SYNC/assignable_entities/stops?page=1&per_page=10&sort='), listResponse)
      .get(client.resolve('/1/SYNC/assignable_entities/stops/1st_and_main'), singleResponse);
  },
  getById: id => assignableStops.list.find(v => v.id === id),
  list: [{
    id: '1st_and_main',
    href: '/1/SYNC/assignable_entities/stops/1st_and_main',
    name: 'First and Main',
    provider_id: 1,
    agency_id: 'SYNC',
  },
  {
    id: '6th_and_olive',
    href: '/1/SYNC/assignable_entities/stops/6th_and_olive',
    name: 'Sixth and Olive',
    provider_id: 1,
    agency_id: 'SYNC',
  }],
};

export default assignableStops;
