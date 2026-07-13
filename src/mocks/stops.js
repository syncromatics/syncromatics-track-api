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
    const listResponseWithIncludePatternHrefs = () => new Response(
      Client.toBlob(stops.listWithIncludePatternHrefs), {
        headers: {
          Link: '</1/SYNC/stops?page=1&per_page=10&q=1st&include=patternHrefs&sort=>; rel="next", </1/SYNC/stops?page=1&per_page=10&q=1st&include=patternHrefs&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(stops.getById(1)));
    const singleResponseWithIncludePatternHrefs = () => new Response(Client.toBlob(stops.getByIdWithIncludePatternHrefs(1)));
    const postResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/stops/1',
      },
    });
    const nearbyResponse = () => new Response(Client.toBlob(stops.list));
    const putResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/stops/1',
      },
    });
   
    fetchMock
        .get(client.resolve('/1/SYNC/stops?page=1&per_page=10&q=1st&sort='), listResponse)
        .get(client.resolve('/1/SYNC/stops?page=1&per_page=10&q=1st&include=patternHrefs&sort='), listResponseWithIncludePatternHrefs)
        .get(client.resolve('/1/SYNC/stops/1'), singleResponse)
        .get(client.resolve('/1/SYNC/stops/1?include=patternHrefs'), singleResponseWithIncludePatternHrefs)
        .post(client.resolve('/1/SYNC/stops'), postResponse)
        .get(client.resolve('/1/SYNC/stops?latitude=40.7128&longitude=-74.006&distanceMeters=200'), nearbyResponse)
        .put(client.resolve('/1/SYNC/stops/1'), putResponse);
  },
  getById: id => stops.list.find(v => v.id === id),
  getByIdWithIncludePatternHrefs: id => stops.listWithIncludePatternHrefs.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/stops/1',
    id: 1,
    name: '1st/Main',
    latitude: 34.081728,
    longitude: -118.351585,
  }],
  listWithIncludePatternHrefs: [{
    href: '/1/SYNC/stops/1',
    id: 1,
    name: '1st/Main',
    latitude: 34.081728,
    longitude: -118.351585,
    patternHrefs: ['/1/SYNC/patterns/1', '/1/SYNC/patterns/2'],
  }],
};

export default stops;
