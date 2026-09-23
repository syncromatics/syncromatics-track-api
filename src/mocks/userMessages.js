// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const userMessages = {
  setUpSuccessfulMock: (client, options = {}) => {
    const {
      roomId = 397,
      message = "John to Jane's room",
      platformType = 2,
      customerCode = 'SYNC',
    } = options;
    const createdMessage = {
      id: 17,
      author_first_name: 'John',
      author_last_name: 'Doe',
      author_id: 406,
      message,
      sent_time: '2026-09-03T14:30:46.263',
      room_href: `/1/${customerCode}/room_messages/${roomId}`,
    };
    const createUri = client.resolve(`/1/${customerCode}/room_messages`, {
      roomId,
      message,
      platformType,
    });

    fetchMock
      .post(createUri, () => new Response(Client.toBlob(createdMessage)))
      .post(
        client.resolve(`/1/${customerCode}/room_messages/read-receipts`),
        () => new Response(Client.toBlob({})),
      );
  },
  list: [
    {
      id: 13,
      author_first_name: 'John',
      author_last_name: 'Doe',
      author_id: 406,
      message: 'John to my room',
      sent_time: '2026-09-03T13:30:46.263',
      room_href: '/1/SYNC/room_messages/406',
    },
    {
      id: 14,
      author_first_name: 'John',
      author_last_name: 'Doe',
      author_id: 421,
      message: "John to Jane's room",
      sent_time: '2026-09-03T13:32:01.327',
      room_href: '/1/SYNC/room_messages/397',
      seen: '2026-09-03T13:37:34.35',
    },
    {
      id: 15,
      author_first_name: 'Jimmy',
      author_last_name: 'Doe',
      author_id: 421,
      message: "Jimmy to Josephine's room",
      sent_time: '2026-09-03T13:32:41.377',
      room_href: '/1/SYNC/room_messages/403',
    },
    {
      id: 16,
      author_first_name: 'Jimmy',
      author_last_name: 'Doe',
      author_id: 421,
      message: "Jimmy to John's room",
      sent_time: '2026-09-03T13:35:34.35',
      room_href: '/1/SYNC/room_messages/406',
      seen: '2026-09-03T13:37:34.35',
    },
  ],
};

export default userMessages;
