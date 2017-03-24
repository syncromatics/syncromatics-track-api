import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import Sign from './Sign';
import { signs as mockSigns } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a sign based on customer and ID', () => {
  const client = new Client();
  const sign = new Sign(client, Sign.makeHref('SYNC', 1));

  it('should set the href', () => sign.href.should.equal('/1/SYNC/signs/1'));
  it('should not be hydrated', () => sign.hydrated.should.equal(false));
});

describe('When instantiating a sign based on an object', () => {
  const client = new Client();
  const sign = new Sign(client, mockSigns.getById(1));

  it('should set the ID', () => sign.id.should.equal(1));
  it('should set the href', () => sign.href.should.equal('/1/SYNC/signs/1'));
  it('should be hydrated', () => sign.hydrated.should.equal(true));
});

describe('When fetching a sign based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mockSigns.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Sign(client, Sign.makeHref('SYNC', 1)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(v => v.id).should.eventually.equal(1));
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC/signs/1'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});
