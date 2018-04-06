// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const runs = {
  setUpSuccessfulMock: (client) => {
    const singleResponse = () => new Response(Client.toBlob(runs.getById(1)));

    fetchMock
      .get(client.resolve('/1/SYNC/runs/1'), singleResponse);
  },
  getById: id => runs.list.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/runs/1',
    id: 1,
    name: 'Run 1',
    short_name: 'R01',
    service: {
      href: '/1/SYNC/services/1',
    },
    trips: [
      { href: '/1/SYNC/trips/1' },
      { href: '/1/SYNC/trips/2' },
    ],
  }],
};

export default runs;
