// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const mesageChannels = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(messageChannels.list), {
      });
    fetchMock.get(client.resolve('/1/SYNC/message_channels'), listResponse);
  },
  getByName: name => messageChannels.list.find(v => v.name === name),
  list: [{
    href: '/1/SYNC/message_channels/Signs',
    name: 'Signs',
  }],
};

export default mesageChannels;
