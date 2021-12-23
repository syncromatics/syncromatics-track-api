// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const callLogs = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(callLogs.list), { });
    const singleResponse = () => new Response(Client.toBlob(callLogs.getById(33)));

    fetchMock
      .get(client.resolve('/1/SYNC/calls_historical'), listResponse)
      .get(client.resolve('/1/SYNC/calls_historical/33'), singleResponse);
  },
  getById: id => callLogs.list.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/calls_historical/33',
    conferenceId: 33,
    started: new Date().toISOString(),
    callDuration: '00:01:01.000',
    isAllActiveUsers: false,
    voipRecordingUrl: '/1/SYNC/calls/33/recording'
  }],
};

export default callLogs;
