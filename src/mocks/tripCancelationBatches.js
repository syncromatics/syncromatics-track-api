// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const tripCancelationBatches = {
    setUpSuccessfulMock: (client) => {
        const fetchResponse = () => new Response(Client.toBlob(tripCancelationBatches.response));
        const createResponse = () => new Response(Client.toBlob(tripCancelationBatches.response));
        const fetchByIdResponse = () => new Response(Client.toBlob(tripCancelationBatches.response.cancelations[0]));

        fetchMock
            .get(client.resolve('/1/SYNC/serviceadjustments/tripcancelations'), fetchResponse)
            .post(client.resolve('/1/SYNC/serviceadjustments/tripcancelations'), createResponse)
            .get(client.resolve('/1/SYNC/serviceadjustments/tripcancelation/1'), fetchByIdResponse)
    },
    getById: id => tripCancelationBatches.response.cancelations.find(v => v.id === id),
    response: {
        cancelations: [{
            href: "/1/SYNC/serviceadjustments/tripcancelation/1",
            id: 1,
            tripId: 4498693,
            customerId: 1,
            serviceDateTime: "2023-12-12T00:00:00",
            createDateTime: "2023-12-12T15:28:47.2885755-08:00",
            uncancel: false,
            userId: 3313
        },
            {
                href: "/1/SYNC/serviceadjustments/tripcancelation/2",
                id: 2,
                tripId: 4498691,
                customerId: 1,
                serviceDateTime: "2023-12-12T00:00:00",
                createDateTime: "2023-12-12T15:28:47.2931379-08:00",
                uncancel: false,
                userId: 3313
            }],
    }
};

export default tripCancelationBatches;
