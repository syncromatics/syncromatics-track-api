import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import Tag from './Tag';
import { tags as mockTags } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a tag based on customer and ID', () => {
  const client = new Client();
  const tag = new Tag(client, Tag.makeHref('SYNC', 3));

  it('should set the href', () => tag.href.should.equal('/1/SYNC/tags/3'));
  it('should not be hydrated', () => tag.hydrated.should.equal(false));
});

describe('When instantiating a tag based on an object', () => {
  const client = new Client();
  const tag = new Tag(client, mockTags.getById(3));

  it('should set the ID', () => tag.id.should.equal(3));
  it('should set the href', () => tag.href.should.equal('/1/SYNC/tags/3'));
  it('should be hydrated', () => tag.hydrated.should.equal(true));
});

describe('When fetching a tag based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mockTags.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Tag(client, Tag.makeHref('SYNC', 3)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(v => v.id).should.eventually.equal(3));
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/tags/3'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});
