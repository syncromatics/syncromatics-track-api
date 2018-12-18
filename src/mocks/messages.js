// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const messages = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(messages.list), {
        headers: {
          Link: '</1/SYNC/messages?page=1&per_page=10&q=5k&sort=>; rel="next", </1/SYNC/messages?page=1&per_page=10&q=5k&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(messages.getById(1)));
    const createResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/messages/1',
      },
    });

    fetchMock
      .get(client.resolve('/1/SYNC/messages?page=1&per_page=10&q=5k&sort='), listResponse)
      .get(client.resolve('/1/SYNC/messages/1'), singleResponse)
      .post(client.resolve('/1/SYNC/messages'), createResponse)
      .put(client.resolve('/1/SYNC/messages/1'), createResponse);
  },
  getById: id => messages.list.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/messages/1',
    id: 1,
    name: '5k Detour',
    text: 'Due to the 5k Race, buses will detour off Figueroa from 6pm to 11am on 2/15/17. Find northbound buses on Hope, southbound buses on Flower.',
    start_date: '2017-02-12T08:00:00-08:00',
    end_date: '2017-02-15T11:00:00-08:00',
    start_time: '08:00:00',
    duration: '02:00:00',
    days_of_week: 'Monday',
    manual_archive_date: null,
    tags: [{
      href: '/1/SYNC/tags/1',
    }],
    routes: [{
      href: '/1/SYNC/routes/1',
    }],
    stops: [{
      href: '/1/SYNC/stops/1',
    }],
    sign_messages: [{
      id: 1,
      override_text: 'Bus Detour Due to 5k Race',
    }],
  }],
};

export default messages;
