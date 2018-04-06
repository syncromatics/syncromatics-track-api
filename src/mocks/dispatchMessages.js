// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const dispatchMessages = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(dispatchMessages.list), {
        headers: {
          Link: '</1/SYNC/dispatchMessages?page=1&per_page=10&q=chatter&sort=>; rel="next", </1/SYNC/dispatch_messages?page=1&per_page=10&q=chatter&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(dispatchMessages.getById(3)));
    const postResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/dispatch_messages/3',
      },
    });
    const putResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/dispatch_messages/3',
      },
    });

    fetchMock
      .get(client.resolve('/1/SYNC/dispatch_messages?page=1&per_page=10&q=chatter&sort='), listResponse)
      .get(client.resolve('/1/SYNC/dispatch_messages/3'), singleResponse)
      .post(client.resolve('/1/SYNC/dispatch_messages'), postResponse)
      .put(client.resolve('/1/SYNC/dispatch_messages/3'), putResponse);
  },
  getById: id => dispatchMessages.list.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/dispatch_messages/3',
    id: 3,
    vehicle: { href: '/1/SYNC/vehicles/1' },
    driver: { href: '/1/SYNC/drivers/1' },
    at_time: '2017-01-01T00:00:00.000-07:00',
    message_direction: 'FromDispatch',
    route: { href: '/1/SYNC/routes/1' },
    dispatch_user: { href: '/1/users/1' },
    customerId: 1,
    message: 'Radio chatter',
  }],
};

export default dispatchMessages;
