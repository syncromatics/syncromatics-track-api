import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import Page from './Page';
import { toBlob } from '../testutils';

chai.should();
chai.use(chaiAsPromised);

describe('When getting a page of results', () => {
  const client = new Client();
  client.setAuthenticated();

  const successfulListResponse = page => () => new Response(
    toBlob(Array.from(new Array(10))
      .map((_, i) => ({
        href: `/example/${(i + (10 * (page - 1)))}`,
      }))),
    {
      headers: {
        Link: (page >= 2 ? [] : [`</list?page=${page + 1}&perPage=10>; rel="next"`])
          .concat(['</list?page=2&perPage=10>; rel="last"']),
      },
    },
  );

  beforeEach(() => {
    fetchMock
      .get(client.resolve('/list?page=1&perPage=10'), successfulListResponse(1))
      .get(client.resolve('/list?page=2&perPage=10'), successfulListResponse(2))
      .catch(503);
  });
  afterEach(fetchMock.restore);

  it('should request the list of results for the current page', () => {
    const page = new Page(client, x => x, '/list').fetch();
    return Promise.all([
      page.should.be.fulfilled,
      page.then(x => x.list[0]).should.become({
        href: '/example/0',
      }),
      page.then(x => x.list.length).should.become(10),
      page.then(x => x.hasNext()).should.become(true),
    ]).should.be.fulfilled;
  });

  it('should request the list of results for the next page', () => {
    const page = new Page(client, x => x, '/list').fetch().then(x => x.next());
    return Promise.all([
      page.should.be.fulfilled,
      page.then(x => x.list[0]).should.become({
        href: '/example/10',
      }),
      page.then(x => x.list.length).should.become(10),
      page.then(x => x.hasNext()).should.become(false),
    ]).should.be.fulfilled;
  });
});
