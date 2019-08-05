// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const roles = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(roles.list), {
        headers: {
          Link: '</1/roles?page=1&per_page=10&q=Di&sort=>; rel="next", </1/roles?page=1&per_page=10&q=DI&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(roles.getById(2)));
    const postResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/roles/4',
      },
    });
    const putResponse = id => () => new Response(undefined, {
      headers: {
        Location: `/1/roles/${id}`,
      },
    });

    fetchMock
      .get(client.resolve('/1/roles?page=1&per_page=10&q=Di&sort='), listResponse)
      .get(client.resolve('/1/roles/2'), singleResponse)
  },
  getById: id => roles.list.find(x => x.id === id),
  list: [
    {
      id: 1,
      href: '/1/roles/1',
      name: 'Supervisor',
      customerAssignable: true,
      sortOrder: 1,
      isDefault: false,
    },
    {
      id: 2,
      href: '/1/roles/2',
      name: 'Dispatcher',
      customerAssignable: true,
      sortOrder: 2,
      isDefault: true,
    },
  ],
};

export default roles;
