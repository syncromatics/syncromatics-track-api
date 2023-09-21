// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const tripCancelations = {
    setUpSuccessfulMock: (client) => {
        const listResponsePaged = () => new Response(
            Client.toBlob(tripCancelations.list), {
                headers: {
                    Link: '</1/SYNC/serviceadjustments/cancelations?page=1&per_page=100&sort=>; rel="next", </1/SYNC/areas?page=1&per_page=100&sort=>; rel="last"'
                },
            });
        const listResponseNext = () => new Response(
            Client.toBlob(tripCancelations.list), {
                headers: {
                    Link: '</1/SYNC/serviceadjustments/cancelations?page=1&per_page=10&sort=>; rel="next", </1/SYNC/areas?page=1&per_page=100&sort=>; rel="last"'
                },
            });
        const postResponse = () => new Response(Client.toBlob(tripCancelations.list), {
            headers: {
                Location: '/1/SYNC/serviceadjustments/cancelations',
            },
        });

        fetchMock
            .get(client.resolve('/1/SYNC/serviceadjustments/cancelations?page=1&per_page=100&sort='), listResponsePaged)
            .get(client.resolve('/1/SYNC/serviceadjustments/cancelations?page=1&per_page=10&sort='), listResponseNext)
            .post(client.resolve('/1/SYNC/serviceadjustments/cancelations'), postResponse)
    },
    list: [{
        href: '/1/SYNC/serviceadjustments/cancelation/1',
        tripId: 333,
        uncancel: false,
    }, {
        href: '/1/SYNC/serviceadjustments/cancelation/2',
        tripId: 444,
        uncancel: true,
    }],
};

export default tripCancelations;
