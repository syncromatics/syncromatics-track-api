// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const callRecordingUrls = {
  setUpSuccessfulMock: (client) => {
    const singleResponse = () => new Response(Client.toBlob(callRecordingUrls.list[0]));

    fetchMock
      .get(client.resolve('/1/SYNC/calls/33/recording'), singleResponse);
  },
  list: [{
    href: '/1/SYNC/calls/33/recording',
  }],
};

export default callRecordingUrls;
