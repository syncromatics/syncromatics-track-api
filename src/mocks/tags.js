// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const tags = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(tags.list), {
        headers: {
          Link: '</1/SYNC/tags?page=1&per_page=10&q=LA&sort=>; rel="next", </1/SYNC/tags?page=1&per_page=10&q=LA&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(tags.getById(3)));
    const postResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/tags/3',
      },
    });
    const putResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/tags/3',
      },
    });

    fetchMock
      .get(client.resolve('/1/SYNC/tags?page=1&per_page=10&q=LA&sort='), listResponse)
      .get(client.resolve('/1/SYNC/tags/3'), singleResponse)
      .post(client.resolve('/1/SYNC/tags'), postResponse)
      .put(client.resolve('/1/SYNC/tags/3'), putResponse);
  },
  getById: id => tags.list.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/tags/3',
    id: 3,
    name: 'DTLA',
    customerId: 1,
  }],
};

export default tags;
