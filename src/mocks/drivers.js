// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const drivers = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(drivers.list), {
        headers: {
          Link: '</1/SYNC/drivers?page=1&per_page=10&q=charlie&sort=>; rel="next", </1/SYNC/drivers?page=1&per_page=10&q=charlie&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(drivers.getById(1)));
    const putResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/drivers/1',
      },
    });
    const postResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/drivers',
      },
    });

    fetchMock
      .get(client.resolve('/1/SYNC/drivers?page=1&per_page=10&sort='), listResponse)
      .get(client.resolve('/1/SYNC/drivers?page=1&per_page=10&q=charlie&sort='), listResponse)
      .get(client.resolve('/1/SYNC/drivers/1'), singleResponse)
      .put(client.resolve('/1/SYNC/drivers/1'), putResponse)
      .put(client.resolve('/1/SYNC/drivers'), postResponse);
  },
  getById: id => drivers.list.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/drivers/1',
    id: 1,
    customer_driver_id: '0001',
    first_name: 'Charlie',
    last_name: 'Singh',
  }],
};

export default drivers;
