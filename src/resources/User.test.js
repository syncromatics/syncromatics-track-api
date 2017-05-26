import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import User from './User';
import { users as mockUsers } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a user based on ID', () => {
  const client = new Client();
  const user = new User(client, User.makeHref(1));

  it('should set the href', () => user.href.should.equal('/1/users/1'));
  it('should not be hydrated', () => user.hydrated.should.equal(false));
});

describe('When instantiating a user based on an object', () => {
  const client = new Client();
  const user = new User(client, mockUsers.getById(1));

  it('should set the ID', () => user.id.should.equal(1));
  it('should set the href', () => user.href.should.equal('/1/users/1'));
  it('should be hydrated', () => user.hydrated.should.equal(true));
});

describe('When fetching a user based on ID', () => {
  const client = new Client();

  beforeEach(() => mockUsers.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new User(client, User.makeHref(1)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(v => v.id).should.eventually.equal(1));
  it('should set the href', () => promise.then(v => v.href).should.eventually.equal('/1/users/1'));
  it('should be hydrated', () => promise.then(v => v.hydrated).should.eventually.equal(true));
});
