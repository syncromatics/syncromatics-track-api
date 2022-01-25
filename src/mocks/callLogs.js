// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const voipCallRecords = {
    setUpSuccessfulMock: (client) => {
        const listResponse = () => new Response(
            Client.toBlob(voipCallRecords.list), {
                headers: {
                    Link: '</1/SYNC/calls_historical?page=1&per_page=10&sort=>; rel="next", </1/SYNC/calls_historical?page=1&per_page=10&sort=>; rel="last"',
                },
            });
        const singleResponse = () => new Response(Client.toBlob(voipCallRecords.getById(33)));

        fetchMock
            .get(client.resolve('/1/SYNC/calls_historical?page=1&per_page=10&sort='), listResponse)
            .get(client.resolve('/1/SYNC/calls_historical/33'), singleResponse);
    },
    getById: conferenceId => voipCallRecords.list.find(v => v.conferenceId === conferenceId),
    list: [{
        href: '/1/SYNC/calls_historical/33',
        conferenceId: 33,
        started: new Date().toISOString(),
        callDuration: '00:01:01.000',
        isAllActiveUsers: false,
    }],
};

export default voipCallRecords;
