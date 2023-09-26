// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const tripCancelations = {
    setUpSuccessfulMock: (client) => {
        const listResponsePaged = () => new Response(
            Client.toBlob(tripCancelations.list), {
                headers: {
                    Link: '</1/SYNC/serviceadjustments/cancelations?page=1&per_page=100&sort=>; rel="next", </1/SYNC/serviceadjustments/cancelations?page=1&per_page=100&sort=>; rel="last"'
                },
            });
        const listResponseNext = () => new Response(
            Client.toBlob(tripCancelations.list), {
                headers: {
                    Link: '</1/SYNC/serviceadjustments/cancelations?page=1&per_page=10&sort=>; rel="next", </1/SYNC/serviceadjustments/cancelations?page=1&per_page=100&sort=>; rel="last"'
                },
            });

        fetchMock
            .get(client.resolve('/1/SYNC/serviceadjustments/cancelations?page=1&per_page=100&sort='), listResponsePaged)
        fetchMock
            .get(client.resolve('/1/SYNC/serviceadjustments/cancelations?page=1&per_page=10&sort='), listResponseNext)
    },
    list: [{
        id: 1,
        tripId: 333,
        uncancel: false,
    }, {
        id: 2,
        tripId: 444,
        uncancel: true,
    }],
};

export default tripCancelations;
