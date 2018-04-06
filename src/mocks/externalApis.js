// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const externalApis = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(externalApis.list), {
        headers: {
          Link: '</1/external_apis?page=1&per_page=10&q=arr&sort=>; rel="next", </1/external_apis?page=1&per_page=10&q=arr&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(externalApis.getById(1)));

    fetchMock
      .get(client.resolve('/1/external_apis?page=1&per_page=10&q=arr&sort='), listResponse)
      .get(client.resolve('/1/external_apis/1'), singleResponse);
  },
  getById: id => externalApis.list.find(e => e.id === id),
  list: [{
    id: 1,
    name: 'arrivals',
    description: 'upcoming arrivals',
    href: '/1/external_apis/1',
  }],
};

export default externalApis;
