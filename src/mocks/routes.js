// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const routes = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(routes.list), {
        headers: {
          Link: '</1/SYNC/routes?page=1&per_page=10&q=blue&sort=>; rel="next", </1/SYNC/routes?page=1&per_page=10&q=blue&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(routes.getById(1)));

    fetchMock
      .get(client.resolve('/1/SYNC/routes?page=1&per_page=10&q=blue&sort='), listResponse)
      .get(client.resolve('/1/SYNC/routes/1'), singleResponse);
  },
  getById: id => routes.list.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/routes/1',
    id: 1,
    name: 'Blue Line',
    short_name: 'Blue',
    description: 'Servicing the Townsville community',
    is_public: true,
    color: '#0000FF',
    text_color: '#FFFFFF',
    patterns: [{
      href: '/1/SYNC/patterns/1',
    }],
  }],
};

export default routes;
