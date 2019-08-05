// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const callParticipants = {
  setUpSuccessfulMock: (client) => {
    const singleResponse = () => new Response(Client.toBlob(callParticipants.getById(2, 3)));
    const postResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/calls/2/participants/3',
      },
    });
    const patchResponse = () => new Response(undefined, {
      headers: {},
    });

    fetchMock
      .get(client.resolve('/1/SYNC/calls/2/participants/3'), singleResponse)
      .post(client.resolve('/1/SYNC/calls/2/participants'), postResponse)
      .patch(client.resolve('/1/SYNC/calls/2/participants/3'), patchResponse);
  },
  getById: (callId, id) => callParticipants.list.find(v =>
    v.call.href === `/1/SYNC/calls/${callId}` && v.id === id),
  list: [
    {
      href: '/1/SYNC/calls/2/participants/3',
      call: { href: '/1/SYNC/calls/2' },
      id: 3,
      type: 'user',
      external_session_id: '82576c1c-9351-4da3-8df1-e3063ae285e7',
      connection_requested: new Date().toISOString(),
      connection_established: undefined,
      connection_terminated: undefined,
      user: '/1/SYNC/users/1',
    },
    {
      href: '/1/SYNC/calls/2/participants/4',
      call: { href: '/1/SYNC/calls/2' },
      id: 4,
      type: 'vehicle',
      external_session_id: '537fafaf-9eea-4b1a-b65c-096ee4ed462f',
      connection_requested: new Date().toISOString(),
      connection_established: undefined,
      connection_terminated: undefined,
      vehicle: '/1/SYNC/vehicles/1',
    },
  ],
};
export default callParticipants;
