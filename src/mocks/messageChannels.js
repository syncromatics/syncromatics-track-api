// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const messageChannels = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(messageChannels.list), {
        headers: {
          Link: '</1/SYNC/messages_channels>',
        },
      });
    fetchMock
      .get(client.resolve('/1/SYNC/message_channels'), listResponse);
  },
  getByName: name => messageChannels.list.find(v => v.name === name),
  list: [{
    href: '/1/SYNC/message_channels/Signs',
    name: 'Signs',
  }],
};

export default messageChannels;
