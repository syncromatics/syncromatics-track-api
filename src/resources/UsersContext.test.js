import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import UsersContext from './UsersContext';
import { users as mockUsers } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When building a query for users', () => {
  const client = new Client();
  client.setAuthenticated();

  beforeEach(() => fetchMock
    .get(client.resolve('/1/SYNC/users?page=21&per_page=42&q=charlie&sort='), mockUsers.list)
    .catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    const users = new UsersContext(client, 'SYNC');
    promise = users
      .withPage(21)
      .withPerPage(42)
      .withQuery('charlie')
      .getPage();
  });

  it('should make the expected request', () => promise.should.be.fulfilled);
});
