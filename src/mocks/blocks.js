// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const blocks = {
  setUpSuccessfulMock: (client) => {
    const singleResponse = () => new Response(Client.toBlob(blocks.getById(1)));

    fetchMock
      .get(client.resolve('/1/SYNC/blocks/1'), singleResponse);
  },
  getById: id => blocks.list.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/blocks/1',
    id: 1,
    name: 'Block 1',
    short_name: 'B01',
    service: {
      href: '/1/SYNC/services/1',
    },
    trips: [
      { href: '/1/SYNC/trips/1' },
      { href: '/1/SYNC/trips/2' },
    ],
  }],
};

export default blocks;
