// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const stopArrivals = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(stopArrivals.list),
    );
    fetchMock.get(client.resolve('/1/SYNC/stops/1/arrivals'), listResponse);
  },
  list: [
    {
      arrive_variance: 30,
      as_of: '2017-01-01T00:00:15.000-07:00',
      pattern: { href: '/1/SYNC/patterns/1' },
      route: { href: '/1/SYNC/routes/1' },
      scheduled_arrival: '2017-01-01T00:00:45.000-07:00',
      seconds_to_arrival: 60,
      source: 'realtime',
      stop: { href: '/1/SYNC/stops/1' },
      trip: { href: '/1/SYNC/trips/1' },
      vehicle: { href: '/1/SYNC/vehicles/1' },
    },
    {
      as_of: '2017-01-01T00:00:15.000-07:00',
      pattern: { href: '/1/SYNC/patterns/1' },
      route: { href: '/1/SYNC/routes/1' },
      seconds_to_arrival: 360,
      source: 'realtime',
      stop: { href: '/1/SYNC/stops/1' },
      vehicle: { href: '/1/SYNC/vehicles/2' },
    },
  ],
};

export default stopArrivals;
