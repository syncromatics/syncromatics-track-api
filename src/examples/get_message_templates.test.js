import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, messageTemplates as mockMessageTemplates } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When searching for message templates by name', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockMessageTemplates.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a list of message templates', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const messageTemplatesPromise = api.customer('SYNC').messageTemplates()
      .withQuery('5k') // MessageTemplates containing "5k" in their name
      .getPage()
      .then(page => page.list)
      .then(messageTemplates => messageTemplates); // Do things with list of message templates

    return messageTemplatesPromise;
  });
});

describe('When retrieving a message template by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockMessageTemplates.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a message template', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const messageTemplatesPromise = api.customer('SYNC').messageTemplate(1)
      .fetch()
      .then(messageTemplate => messageTemplate); // Do things with messageTemplate

    return messageTemplatesPromise;
  });
});

describe('When creating a message template', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockMessageTemplates.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should save a message template', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const messageTemplatesPromise = api.customer('SYNC').messageTemplate({
      href: '/1/SYNC/message_templates/1',
      id: 1,
      name: '5k Detour',
      text: 'Due to the 5k Race, buses will detour off Figueroa from 6pm to 11am on 2/15/17. Find northbound buses on Hope, southbound buses on Flower.',
      start: '2017-02-12T08:00:00-08:00',
      end: '2017-02-15T11:00:00-08:00',
      sign_messages: [
        {
          id: 1,
          override_text: 'Due to the 5k, buses will be on detour.',
          schedules: [
            {
              day_of_week: 1,
              start: '06:00:00',
              end: '18:00:00',
            },
          ],
          tags: [
            {
              href: '/1/SYNC/tags/1',
            },
          ],
          routes: [
            {
              href: '/1/SYNC/routes/1',
            },
          ],
          stops: [
            {
              href: '/1/SYNC/stops/1',
            },
          ],
          signs: [
            {
              href: '/1/SYNC/signs/1',
            },
          ],
        },
      ],
    })
      .create()
      .then(messageTemplate => messageTemplate); // Do things with messageTemplate

    return messageTemplatesPromise;
  });
});

describe('When updating a message template', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockMessageTemplates.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should update a message template', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const messageTemplatesPromise = api.customer('SYNC').messageTemplate(1)
      .fetch()
      .then((template) => {
        // eslint-disable-next-line no-param-reassign
        template.name = 'Updated Template Name';
        return template.update();
      });

    return messageTemplatesPromise;
  });
});
