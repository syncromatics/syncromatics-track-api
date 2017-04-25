import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import MessageTemplate from './MessageTemplate';
import { messageTemplates as mockMessageTemplates } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a message template based on customer and ID', () => {
  const client = new Client();
  const messageTemplate = new MessageTemplate(client, MessageTemplate.makeHref('SYNC', 1));

  it('should set the href', () => messageTemplate.href.should.equal('/1/SYNC/message_templates/1'));
  it('should not be hydrated', () => messageTemplate.hydrated.should.equal(false));
});

describe('When instantiating a message template based on an object', () => {
  const client = new Client();
  const messageTemplate = new MessageTemplate(client, mockMessageTemplates.getById(1));

  it('should set the ID', () => messageTemplate.id.should.equal(1));
  it('should set the href', () => messageTemplate.href.should.equal('/1/SYNC/message_templates/1'));
  it('should be hydrated', () => messageTemplate.hydrated.should.equal(true));
});

describe('When fetching a message template based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mockMessageTemplates.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new MessageTemplate(client, MessageTemplate.makeHref('SYNC', 1)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(v => v.id).should.eventually.equal(1));
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/message_templates/1'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});

describe('When creating a message template', () => {
  const client = new Client();

  beforeEach(() => mockMessageTemplates.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new MessageTemplate(client, { code: 'SYNC',
      ...{

        name: '5k Detour',
        text: 'Due to the 5k Race, buses will detour off Figueroa from 6pm to 11am on 2/15/17. Find northbound buses on Hope, southbound buses on Flower.',
        start: '2017-02-12T08:00:00-08:00',
        end: '2017-02-15T11:00:00-08:00',
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
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/message_templates/1'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});

describe('When updating a message template', () => {
  const client = new Client();
  const updateValue = 'newTemplateName';

  beforeEach(() => mockMessageTemplates.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new MessageTemplate(client, { code: 'SYNC',
      ...{

        name: '5k Detour',
        text: 'Due to the 5k Race, buses will detour off Figueroa from 6pm to 11am on 2/15/17. Find northbound buses on Hope, southbound buses on Flower.',
        start: '2017-02-12T08:00:00-08:00',
        end: '2017-02-15T11:00:00-08:00',
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
    .then((messageTemplate) => {
    // eslint-disable-next-line no-param-reassign
      messageTemplate.name = updateValue;
      return messageTemplate.update();
    })
    .then(messageTemplate => messageTemplate);
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(v => v.id).should.eventually.equal(1));
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/message_templates/1'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});
