// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const detours = {
    setUpSuccessfulMock: (client) => {
        const singleResponse = () => new Response(Client.toBlob(detours.response));
        const historicalResponse = () => new Response(Client.toBlob(detours.historicalResponse));

        fetchMock
            .get(client.resolve('/2/SYNC/serviceadjustments/detours'), singleResponse)
            .get(client.resolve('/2/SYNC/serviceadjustments/detours/historical'), historicalResponse)
            .get(client.resolve('/2/SYNC/serviceadjustments/detours/historical?from=2024-01-01T00:00:00.000Z'), historicalResponse)
            .get(client.resolve('/2/SYNC/serviceadjustments/detours/historical?from=2024-01-01T00:00:00.000Z&until=2024-02-01T00:00:00.000Z'), historicalResponse)
            .get(client.resolve('/2/SYNC/serviceadjustments/detours/historical?includeDeactivated=true'), historicalResponse)
            .get(client.resolve('/2/SYNC/serviceadjustments/detours/historical?from=2024-01-01T00:00:00.000Z&includeDeactivated=true'), historicalResponse)
            .get(client.resolve('/2/SYNC/serviceadjustments/detours/historical?from=2024-01-01T00:00:00.000Z&until=2024-02-01T00:00:00.000Z&includeDeactivated=true'), historicalResponse)
            .post(client.resolve('/2/SYNC/serviceadjustments/detours'), () => singleResponse())
            .delete(client.resolve(`/2/SYNC/serviceadjustments/detours/2`), () => singleResponse())
    },
    response: {
        client: {
            options: {
                baseUri: "https://track-api.syncromatics.com"
            },
            jwt: {
                token: "token-here",
                header: {
                    alg: "HS256",
                    typ: "JWT"
                },
                claim: {
                    // Claims
                },
                signature: "ABC123"
            },
            authenticated: {}
        },
        hydrated: true,
        detours: {
            "96": [
                {
                    detour_id: 189,
                    customer_id: 1,
                    pattern_id: 96,
                    detour_pattern_id: 44420,
                    title: "Detour created from Mock Tests.",
                    should_match_scheduled_stops: true,
                    creator_user_id: 397,
                    created_date_time: "2024-07-22T16:45:57.168336+00:00",
                    deactivator_user_id: 397,
                    deactivated_date_time: "2024-07-22T18:58:29+00:00",
                    start_date_time: "2024-07-23T01:00:00-07:00",
                    end_date_time: "2024-07-23T01:30:00-07:00"
                },
                {
                    detour_id: 200,
                    customer_id: 1,
                    pattern_id: 96,
                    detour_pattern_id: 44420,
                    title: "Detour created from Mock Tests.",
                    should_match_scheduled_stops: true,
                    creator_user_id: 397,
                    created_date_time: "2024-07-22T16:45:57.168336+00:00",
                    start_date_time: "2024-07-23T01:00:00-07:00",
                    end_date_time: "2024-07-23T01:30:00-07:00"
                }
            ],
            "40062": [
                {
                    detour_id: 194,
                    customer_id: 1,
                    pattern_id: 40062,
                    detour_pattern_id: 12206,
                    title: "Detour created from Mock Tests.",
                    should_match_scheduled_stops: true,
                    creator_user_id: 397,
                    created_date_time: "2024-07-23T12:55:25.8659593+00:00",
                    start_date_time: "2024-07-23T01:00:00-07:00",
                    end_date_time: "2024-07-23T01:15:00-07:00"
                }
            ]
        }
    },
    historicalResponse: [
        {
            detour_id: 189,
            customer_id: 1,
            pattern_id: 96,
            detour_pattern_id: 44420,
            title: "Historical Detour 1",
            should_match_scheduled_stops: true,
            creator_user_id: 397,
            created_date_time: "2024-01-15T16:45:57.168336+00:00",
            deactivator_user_id: 397,
            deactivated_date_time: "2024-01-16T18:58:29+00:00",
            start_date_time: "2024-01-15T01:00:00-07:00",
            end_date_time: "2024-01-16T01:30:00-07:00",
            href: "/2/SYNC/serviceadjustments/detours/189"
        },
        {
            detour_id: 194,
            customer_id: 1,
            pattern_id: 40062,
            detour_pattern_id: 12206,
            title: "Historical Detour 2",
            should_match_scheduled_stops: true,
            creator_user_id: 397,
            created_date_time: "2024-01-20T12:55:25.8659593+00:00",
            deactivator_user_id: 397,
            deactivated_date_time: "2024-01-21T12:55:25.8659593+00:00",
            start_date_time: "2024-01-20T01:00:00-07:00",
            end_date_time: "2024-01-21T01:15:00-07:00",
            href: "/2/SYNC/serviceadjustments/detours/194"
        }
    ]
};

export default detours;