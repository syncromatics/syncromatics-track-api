// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const tripCancelationBatches = {
    setUpSuccessfulMock: (client) => {
        const fetchResponse = () => new Response(Client.toBlob(tripCancelationBatches.response));
        const createResponse = () => new Response(Client.toBlob(tripCancelationBatches.response));

        fetchMock
            .get(client.resolve('/1/SYNC/serviceadjustments/cancelations'), fetchResponse)
            .post(client.resolve('/1/SYNC/serviceadjustments/cancelations'), createResponse);
    },
    response: [
        {href: '/1/SYNC/serviceadjustments/cancelations/1'},
        {href: '/1/SYNC/serviceadjustments/cancelations/2'},
    ],
};

export default tripCancelationBatches;
