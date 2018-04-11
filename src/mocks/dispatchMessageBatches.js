// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const dispatchMessageBatches = {
  setUpSuccessfulMock: (client) => {
    const singleResponse = () => new Response(Client.toBlob(dispatchMessageBatches.getById('90892e24-5279-4066-b109-a112925edb89')));
    const postResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/dispatch_messages/batches/90892e24-5279-4066-b109-a112925edb89',
      },
    });

    fetchMock
      .get(client.resolve('/1/SYNC/dispatch_messages/batches/90892e24-5279-4066-b109-a112925edb89'), singleResponse)
      .post(client.resolve('/1/SYNC/dispatch_messages/batches'), postResponse);
  },
  getById: id => dispatchMessageBatches.list.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/dispatch_messages/batches/90892e24-5279-4066-b109-a112925edb89',
    id: '90892e24-5279-4066-b109-a112925edb89',
    dispatch_messages: [
      { href: '/1/SYNC/dispatch_messages/1' },
      { href: '/1/SYNC/dispatch_messages/2' },
    ],
  }],
};

export default dispatchMessageBatches;
