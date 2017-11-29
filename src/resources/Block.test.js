import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import Block from './Block';
import { blocks as mockBlocks } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a block based on customer and ID', () => {
  const client = new Client();
  const block = new Block(client, Block.makeHref('SYNC', 1));

  it('should set the href', () => block.href.should.equal('/1/SYNC/blocks/1'));
  it('should not be hydrated', () => block.hydrated.should.equal(false));
});

describe('When instantiating a block based on an object', () => {
  const client = new Client();
  const block = new Block(client, mockBlocks.getById(1));

  it('should set the ID', () => block.id.should.equal(1));
  it('should set the href', () => block.href.should.equal('/1/SYNC/blocks/1'));
  it('should be hydrated', () => block.hydrated.should.equal(true));
  it('should set the name', () => block.name.should.equal('Block 1'));
  it('should set the short name', () => block.short_name.should.equal('B01'));
  it('should map the service', () => block.service.href.should.equal('/1/SYNC/services/1'));
  it('should map every trip', () => block.trips.length.should.equal(2));
});

describe('When fetching a block based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mockBlocks.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Block(client, Block.makeHref('SYNC', 1)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(p => p.id).should.eventually.equal(1));
  it('should set the href', () => promise.then(p => p.href).should.eventually.equal('/1/SYNC/blocks/1'));
  it('should be hydrated', () => promise.then(p => p.hydrated).should.eventually.equal(true));
  it('should set the name', () => promise.then(p => p.name).should.eventually.equal('Block 1'));
  it('should set the short name', () => promise.then(p => p.short_name).should.eventually.equal('B01'));
  it('should map the service', () => promise.then(p => p.service.href).should.eventually.equal('/1/SYNC/services/1'));
  it('should map every trip', () => promise.then(p => p.trips.length).should.eventually.equal(2));
});
