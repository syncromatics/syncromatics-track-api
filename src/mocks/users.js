// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const users = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(users.list), {
        headers: {
          Link: '</1/users?page=1&per_page=10&q=1st&sort=>; rel="next", </1/users?page=1&per_page=10&q=1st&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(users.getById(1)));
    const putResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/users/1',
      },
    });

    fetchMock
      .get(client.resolve('/1/users?page=1&per_page=10&q=1st&sort='), listResponse)
      .get(client.resolve('/1/users/1'), singleResponse)
      .get(client.resolve('/1/users/me'), singleResponse)
      .put(client.resolve('/1/users/1'), putResponse)
      .put(client.resolve('/1/users/me'), putResponse);
  },
  getById: id => users.list.find(v => v.id === id),
  list: [{
    href: '/1/users/1',
    id: 1,
    preferences: {
      track: {
        homepage: '/trk',
      },
    },
  }],
};

export default users;
