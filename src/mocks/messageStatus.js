// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const messageStatus = {
  setUpSuccessfulMock: (client) => {
    const singleResponse = () => new Response(Client.toBlob({}));

    fetchMock
      .post(client.resolve('/1/SYNC/dispatch_message_statuses'), singleResponse);
  },
  list: [{
    href: '/1/SYNC/dispatch_message_statuses/101',
    id: 101,
  }],
};

export default messageStatus;
