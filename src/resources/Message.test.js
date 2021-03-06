import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import Message from './Message';
import { messages as mockMessages } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a message based on customer and ID', () => {
  const client = new Client();
  const message = new Message(client, Message.makeHref('SYNC', 1));

  it('should set the href', () => message.href.should.equal('/1/SYNC/messages/1'));
  it('should not be hydrated', () => message.hydrated.should.equal(false));
});

describe('When instantiating a message based on an object', () => {
  const client = new Client();
  const message = new Message(client, mockMessages.getById(1));

  it('should set the ID', () => message.id.should.equal(1));
  it('should set the href', () => message.href.should.equal('/1/SYNC/messages/1'));
  it('should be hydrated', () => message.hydrated.should.equal(true));
});

describe('When fetching a message based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mockMessages.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Message(client, Message.makeHref('SYNC', 1)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(v => v.id).should.eventually.equal(1));
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/messages/1'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});

describe('When creating a message', () => {
  const client = new Client();

  beforeEach(() => mockMessages.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Message(client, {
      code: 'SYNC',
      ...{

        name: '5k Detour',
        text: 'Due to the 5k Race, buses will detour off Figueroa from 6pm to 11am on 2/15/17. Find northbound buses on Hope, southbound buses on Flower.',
        start: '2017-02-12T08:00:00-08:00',
        end: '2017-02-15T11:00:00-08:00',
        manual_archive_date: null,
        sign_messages: [
          {
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
      },
    }).create();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(v => v.id).should.eventually.equal(1));
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/messages/1'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});

describe('When updating a message', () => {
  const client = new Client();
  const updateValue = 'newMessageName';

  beforeEach(() => mockMessages.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Message(client, {
      code: 'SYNC',
      ...{

        name: '5k Detour',
        text: 'Due to the 5k Race, buses will detour off Figueroa from 6pm to 11am on 2/15/17. Find northbound buses on Hope, southbound buses on Flower.',
        start: '2017-02-12T08:00:00-08:00',
        end: '2017-02-15T11:00:00-08:00',
        manual_archive_date: null,
        sign_messages: [
          {
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
      },
    }).create()
      .then((message) => {
        // eslint-disable-next-line no-param-reassign
        message.name = updateValue;
        return message.update();
      })
      .then(message => message);
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(v => v.id).should.eventually.equal(1));
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/messages/1'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});
