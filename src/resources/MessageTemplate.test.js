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
