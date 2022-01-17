// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const calls = {
  setUpSuccessfulMock: (client) => {
    const singleResponse = () => new Response(Client.toBlob(calls.getById(3)));
    const postResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/calls/3',
      },
    });
    const patchResponse = () => new Response(undefined, {
      headers: {},
    });

    fetchMock
      .get(client.resolve('/1/SYNC/calls/3'), singleResponse)
      .post(client.resolve('/1/SYNC/calls'), postResponse)
      .patch(client.resolve('/1/SYNC/calls/3'), patchResponse);
  },
  getById: id => calls.list.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/calls/3',
    id: 3,
    started: new Date().toISOString(),
    ended: undefined,
    initiating_user: { href: '/1/users/1' },
    participants: [
      {
        href: '/1/SYNC/calls/3/participants/1',
        id: 1,
        type: 'user',
        external_session_id: '82576c1c-9351-4da3-8df1-e3063ae285e7',
        connection_requested: new Date().toISOString(),
        connection_established: undefined,
        connection_terminated: undefined,
        user: { href: '/1/SYNC/users/1' },
      },
      {
        href: '/1/SYNC/calls/3/participants/2',
        id: 2,
        type: 'vehicle',
        external_session_id: '537fafaf-9eea-4b1a-b65c-096ee4ed462f',
        connection_requested: new Date().toISOString(),
        connection_established: undefined,
        connection_terminated: undefined,
        vehicle: { href: '/1/SYNC/vehicles/1' },
      },
    ],
  }],
};

export default calls;
