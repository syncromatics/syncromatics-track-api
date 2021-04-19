// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const assignableRoutes = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(assignableRoutes.list), {
        headers: {
          Link: '</1/SYNC/assignable_entities/routes?page=1&per_page=10&sort=>; rel="next", </1/SYNC/assignable_entities/routes?page=1&per_page=10&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(assignableRoutes.getById('blue_line')));

    fetchMock
      .get(client.resolve('/1/SYNC/assignable_entities/routes?page=1&per_page=10&sort='), listResponse)
      .get(client.resolve('/1/SYNC/assignable_entities/routes/blue_line'), singleResponse);
  },
  getById: id => assignableRoutes.list.find(v => v.id === id),
  list: [{
    id: 'blue_line',
    href: '/1/SYNC/assignable_entities/routes/blue_line',
    name: 'Blue Line',
    short_name: 'BLU',
    color: '#0000FF',
    text_color: '#FFFFFF',
    provider_id: 1,
    agency_id: 'SYNC',
    route_type: 'MetropolitanStreetLevelRail'
  },
  {
    id: 'red_line',
    href: '/1/SYNC/assignable_entities/routes/red_line',
    name: 'Red Line',
    short_name: 'RED',
    color: '#FF0000',
    text_color: '#FFFFFF',
    provider_id: 1,
    agency_id: 'SYNC',
    route_type: 'MetropolitanUndergroundRail'
  }],
};

export default assignableRoutes;
