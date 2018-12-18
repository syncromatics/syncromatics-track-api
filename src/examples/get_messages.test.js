import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, messages as mockMessages } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When searching for messages by name', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockMessages.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a list of messages', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const messagesPromise = api.customer('SYNC').messages()
      .withQuery('5k') // Messages containing "5k" in their name
      .getPage()
      .then(page => page.list)
      .then(messages => messages); // Do things with list of messages

    return messagesPromise;
  });
});

describe('When retrieving a message by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockMessages.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a message', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const messagePromise = api.customer('SYNC').message(1)
      .fetch()
      .then(message => message); // Do things with message

    return messagePromise;
  });
});

describe('When creating a message', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockMessages.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should save a message', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const messagePromise = api.customer('SYNC')
      .message({
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
      })
      .create()
      .then(message => message); // Do things with message

    return messagePromise;
  });
});

describe('When updating a message', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockMessages.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should update a message', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const messagePromise = api.customer('SYNC').message(1)
      .fetch()
      .then((message) => {
        // eslint-disable-next-line no-param-reassign
        message.name = 'Updated Message Name';
        return message.update();
      });

    return messagePromise;
  });
});
