// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const trips = {
  setUpSuccessfulMock: (client) => {
    const singleResponse = () => new Response(Client.toBlob(trips.getById(3)));

    fetchMock
      .get(client.resolve('/1/SYNC/trips/3'), singleResponse);
  },
  getById: id => trips.list.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/trips/3',
    id: 3,
    name: 'T03',
    short_name: 'T3',
    order: 1,
    pattern: {
      href: '/1/SYNC/patterns/1',
    },
    service: {
      href: '/1/SYNC/services/1',
    },
    block: {
      href: '/1/SYNC/blocks/1',
    },
    runs: [{
      href: '/1/SYNC/runs/1',
    }],
  }],
};

export default trips;
