import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import Area from './Area';
import { areas as mockAreas } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating an area based on customer and ID', () => {
  const client = new Client();
  const area = new Area(client, Area.makeHref('SYNC', 1));

  it('should set the href', () => area.href.should.equal('/1/SYNC/areas/1'));
  it('should not be hydrated', () => area.hydrated.should.equal(false));
});

describe('When instantiating an area based on an object', () => {
  const client = new Client();
  const area = new Area(client, mockAreas.getById(1));

  it('should set the ID', () => area.id.should.equal(1));
  it('should set the href', () => area.href.should.equal('/1/SYNC/areas/1'));
  it('should be hydrated', () => area.hydrated.should.equal(true));
  it('should have the expected name', () => area.name.should.equal('South Yard'));
  it('should have the expected encoded_polygon', () =>
    area.encoded_polygon.should.equal('crneFnwljVa...'));
  it('should have the expected area_type', () => area.area_type.should.equal('Yard'));
});

describe('When fetching an area based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mockAreas.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Area(client, Area.makeHref('SYNC', 1)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(p => p.id).should.eventually.equal(1));
  it('should set the href', () => promise.then(p => p.href).should.eventually.equal('/1/SYNC/areas/1'));
  it('should be hydrated', () => promise.then(p => p.hydrated).should.eventually.equal(true));
  it('should have the expected name', () => promise.then(p => p.name).should.eventually.equal('South Yard'));
  it('should have the expected encoded_polygon', () =>
    promise.then(p => p.encoded_polygon).should.eventually.equal('crneFnwljVa...'));
  it('should have the expected area_type', () => promise.then(p => p.area_type).should.eventually.equal('Yard'));
});
