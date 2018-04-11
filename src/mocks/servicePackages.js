// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const servicePackages = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(servicePackages.list), {
        headers: {
          Link: '</1/SYNC/service_packages?page=1&per_page=10&q=first&sort=>; rel="next", </1/SYNC/service_packages?page=1&per_page=10&q=first&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(servicePackages.getById(1)));

    fetchMock
      .get(client.resolve('/1/SYNC/service_packages?page=1&per_page=10&q=first&sort='), listResponse)
      .get(client.resolve('/1/SYNC/service_packages/1'), singleResponse);
  },
  getById: id => servicePackages.list.find(v => v.id === id),
  list: [
    {
      href: '/1/SYNC/service_packages/1',
      id: 1,
      name: 'First Package',
      services: [
        { href: '/1/SYNC/services/1' },
        { href: '/1/SYNC/services/2' },
        { href: '/1/SYNC/services/3' },
      ],
    },
    {
      href: '/1/SYNC/service_packages/2',
      id: 2,
      name: 'Second Package',
      services: [
        { href: '/1/SYNC/services/4' },
        { href: '/1/SYNC/services/5' },
        { href: '/1/SYNC/services/6' },
      ],
    },
  ],
};

export default servicePackages;
