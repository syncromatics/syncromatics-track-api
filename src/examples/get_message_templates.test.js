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
