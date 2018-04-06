// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const messageTemplates = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(messageTemplates.list), {
        headers: {
          Link: '</1/SYNC/message_templates?page=1&per_page=10&q=5k&sort=>; rel="next", </1/SYNC/message_templates?page=1&per_page=10&q=5k&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(messageTemplates.getById(1)));
    const createResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/message_templates/1',
      },
    });

    fetchMock
      .get(client.resolve('/1/SYNC/message_templates?page=1&per_page=10&q=5k&sort='), listResponse)
      .get(client.resolve('/1/SYNC/message_templates/1'), singleResponse)
      .post(client.resolve('/1/SYNC/message_templates'), createResponse)
      .put(client.resolve('/1/SYNC/message_templates/1'), createResponse);
  },
  getById: id => messageTemplates.list.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/message_templates/1',
    id: 1,
    name: '5k Detour',
    text: 'Due to the 5k Race, buses will detour off Figueroa from 6pm to 11am on 2/15/17. Find northbound buses on Hope, southbound buses on Flower.',
    start: '2017-02-12T08:00:00-08:00',
    end: '2017-02-15T11:00:00-08:00',
    manual_archive_date: null,
    sign_messages: [{
      id: 1,
      override_text: 'Due to the 5k, buses will be on detour.',
      schedules: [{
        day_of_week: 1,
        start: '06:00:00',
        end: '18:00:00',
      }],
      tags: [{
        href: '/1/SYNC/tags/1',
      }],
      routes: [{
        href: '/1/SYNC/routes/1',
      }],
      stops: [{
        href: '/1/SYNC/stops/1',
      }],
      signs: [{
        href: '/1/SYNC/signs/1',
      }],
    }],
  }],
};

export default messageTemplates;
