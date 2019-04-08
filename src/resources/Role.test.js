import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import Role from './Role';
import { roles as mockRoles } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a role based on ID', () => {
  const client = new Client();
  const role = new Role(client, Role.makeHref(2));

  it('should set the href', () => role.href.should.equal('/1/roles/2'));
  it('should not be hydrated', () => role.hydrated.should.equal(false));
});

describe('When instantiating a role based on an object', () => {
  const client = new Client();
  const role = new Role(client, mockRoles.getById(2));

  it('should set the ID', () => role.id.should.equal(2));
  it('should set the href', () => role.href.should.equal('/1/roles/2'));
  it('should be hydrated', () => role.hydrated.should.equal(true));
});

describe('When fetching a role based on ID', () => {
  const client = new Client();

  beforeEach(() => mockRoles.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Role(client, Role.makeHref(2)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(x => x.id).should.eventually.equal(2));
  it('should set the href', () => promise.then(x => x.href).should.eventually.equal('/1/roles/2'));
  it('should be hydrated', () => promise.then(x => x.hydrated).should.eventually.equal(true));
});

describe('When creating a role', () => {
  const client = new Client();

  beforeEach(() => mockRoles.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new Role(client, {
      name: 'Limited User',
      customerAssignable: true,
      sortOrder: 5,
      isDefault: false,
    }).create();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the href', () => promise.then(x => x.href).should.eventually.equal('/1/roles/4'));
  it('should set the ID', () => promise.then(x => x.id).should.eventually.equal(4));
});

describe('When updating a role', () => {
  const client = new Client();
  const updatedValue = 'Junior Dispatcher';

  beforeEach(() => mockRoles.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const originalValues = {
      name: 'Limited User',
      customerAssignable: true,
      sortOrder: 5,
      isDefault: false,
    };
    promise = new Role(client, originalValues)
    .create()
    .then((role) => {
      // eslint-disable-next-line no-param-reassign
      role.name = updatedValue;
      return role.update();
    });
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the href', () => promise.then(x => x.href).should.eventually.equal('/1/roles/4'));
  it('should set the name', () => promise.then(x => x.name).should.eventually.equal(updatedValue));
});
