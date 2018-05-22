// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const vehicleArrivals = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(vehicleArrivals.list),
    );
    fetchMock.get(client.resolve('/1/SYNC/vehicles/1/arrivals'), listResponse);
  },
  list: [
    {
      secondsToArrival: 60,
      as_of: '2017-01-01T00:00:00.000-07:00',
      source: 'realtime',
      pattern: { href: '/1/SYNC/patterns/1' },
      route: { href: '/1/SYNC/routes/1' },
      stop: { href: '/1/SYNC/stops/1' },
      vehicle: { href: '/1/SYNC/vehicles/1' },
    },
    {
      secondsToArrival: 360,
      as_of: '2017-01-01T00:00:00.000-07:00',
      source: 'realtime',
      pattern: { href: '/1/SYNC/patterns/1' },
      route: { href: '/1/SYNC/routes/1' },
      stop: { href: '/1/SYNC/stops/2' },
      vehicle: { href: '/1/SYNC/vehicles/1' },
    },
  ],
};

export default vehicleArrivals;
