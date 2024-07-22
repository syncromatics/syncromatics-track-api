// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const detours = {
    setUpSuccessfulMock: (client) => {
        const singleResponse = () => new Response(Client.toBlob(detours.list));

        fetchMock
            .get(client.resolve('/1/SYNC/serviceadjustments/detours'), singleResponse)
            .post(client.resolve('/1/SYNC/serviceadjustments/detours'), (newDetour) => new Response(Client.toBlob([...detours.list, newDetour])))
            .delete(client.resolve(`/1/SYNC/serviceadjustments/detours/2`), {
              status: 200,
              body: Client.toBlob(detours.list.filter(detour => detour.detour_id !== 2))
            });
    },
    list: [
        {
            detour_id: 2,
            customer_id: 123,
            pattern_id: 456,
            detour_pattern_id: 789,
            title: 'A Detour',
            should_match_scheduled_stops: true,
            creator_user_id: 101,
            created_date_time: new Date().toISOString(),
            deactivator_user_id: null,
            deactivated_date_time: null,
            start_date_time: new Date('2023-01-01T09:00:00Z').toISOString(),
            end_date_time: new Date('2023-01-15T17:00:00Z').toISOString(),
        },
        {
            detour_id: 3,
            customer_id: 123,
            pattern_id: 323,
            detour_pattern_id: 433,
            title: 'Another Detour',
            should_match_scheduled_stops: true,
            creator_user_id: 101,
            created_date_time: new Date().toISOString(),
            deactivator_user_id: null,
            deactivated_date_time: null,
            start_date_time: new Date('2023-01-01T09:00:00Z').toISOString(),
            end_date_time: new Date('2023-01-15T17:00:00Z').toISOString(),
        }
    ]
};

export default detours;