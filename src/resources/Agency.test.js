import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import Agency from './Agency';
import { agencies as mockAgencies } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating an agency based on customer', () => {
  const client = new Client();
  const agency = new Agency(client, Agency.makeHref('SYNC'));

  it('should set the href', () => agency.href.should.equal('/1/SYNC'));
  it('should not be hydrated', () => agency.hydrated.should.equal(false));
});

describe('When instantiating an agency based on an object', () => {
  const client = new Client();
  const agency = new Agency(client, mockAgencies.getByCode('SYNC'));

  it('should set the href', () => agency.href.should.equal('/1/SYNC'));
  it('should be hydrated', () => agency.hydrated.should.equal(true));
});

describe('When fetching an agency based on customer', () => {
  const client = new Client();

  beforeEach(() => mockAgencies.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Agency(client, Agency.makeHref('SYNC')).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the code', () => promise.then(v => v.code).should.eventually.equal('SYNC'));
  it('should set the name', () =>
    promise.then(v => v.name).should.eventually.equal('Syncromatics Transit Agency'));
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});

describe('When updating an agency', () => {
  const client = new Client();
  const updateValue = 'https://www.syncromatics.com/overview/';

  beforeEach(() => mockAgencies.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Agency(client, Agency.makeHref('SYNC'))
      .fetch()
      .then((agency) => {
        // eslint-disable-next-line no-param-reassign
        agency.agency_url = updateValue;
        return agency.update();
      })
      .then(agency => agency);
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/SYNC'));
  it('should set the fare url', () =>
    promise.then(v => v.agency_url).should.eventually.equal(updateValue));
});
