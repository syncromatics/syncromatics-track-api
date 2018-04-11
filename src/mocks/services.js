// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const services = {
  setUpSuccessfulMock: (client) => {
    const singleResponse = () => new Response(Client.toBlob(services.getById(1)));
    fetchMock
      .get(client.resolve('/1/SYNC/services/1'), singleResponse);
  },
  getById: id => services.list.find(s => s.id === id),
  list: [
    {
      href: '/1/SYNC/services/1',
      id: 1,
      start: '2017-01-01T00:00:00.000-0700',
      end: '2017-04-01T00:00:00.000-0700',
      days_of_week: 'Sunday, Saturday',
      blocks: [
        { href: '/1/SYNC/blocks/1' },
        { href: '/1/SYNC/blocks/2' },
      ],
      runs: [
        {
          href: '/1/SYNC/runs/1',
          id: 1,
          name: 'Run 1',
          short_name: 'R01',
          service: {
            href: '/1/SYNC/services/1',
          },
          trips: [
            { href: '/1/SYNC/trips/1' },
          ],
        },
        {
          href: '/1/SYNC/runs/2',
          id: 1,
          name: 'Run 2',
          short_name: 'R02',
          service: {
            href: '/1/SYNC/services/1',
          },
          trips: [
            { href: '/1/SYNC/trips2' },
          ],
        },
      ],
      trips: [
        {
          href: '/1/SYNC/trips/1',
          id: 1,
          name: 'T01',
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
        },
        {
          href: '/1/SYNC/trips/2',
          id: 2,
          name: 'T02',
          order: 2,
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
            href: '/1/SYNC/runs/2',
          }],
        },
      ],
    },
  ],
};

export default services;
