import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from './Client';
import { NotFoundResponse, ServerErrorResponse } from './responses';

chai.should();
chai.use(chaiAsPromised);

describe('When resolving URIs', () => {
  it('should resolve root URIs, regardless of the baseUri', () => {
    const client = new Client({
      baseUri: 'http://example.com/invalid/',
    });
    client.resolve('/valid').should.equal('http://example.com/valid');
  });

  it('should resolve URIs relative to the baseUri when baseUri does not end with /', () => {
    const client = new Client({
      baseUri: 'http://example.com/root/',
    });
    client.resolve('valid').should.equal('http://example.com/root/valid');
  });

  it('should resolve URIs relative to the baseUri when baseUri ends with /', () => {
    const client = new Client({
      baseUri: 'http://example.com/root/invalid',
    });
    client.resolve('valid').should.equal('http://example.com/root/valid');
  });
});

describe('When using the client to make GET requests', () => {
  beforeEach(() => {
    fetchMock
      .get('http://example.com/success', { success: true })
      .get('http://example.com/success?foo=bar', { successWithQueryString: true })
      .catch(503);
  });
  afterEach(fetchMock.restore);

  const client = new Client({
    baseUri: 'http://example.com',
  });

  it('should make a successful GET request', () =>
    client.get('/success')
      .then(response => response.json())
      .should.eventually.become({ success: true }));

  it('should make a successful GET request with query string parameters', () =>
    client.get('/success', { foo: 'bar' })
      .then(response => response.json())
      .should.eventually.become({ successWithQueryString: true }));
});

describe('When using the client to make POST requests', () => {
  beforeEach(() => {
    fetchMock
      .post('http://example.com/success', { success: true })
      .catch(503);
  });
  afterEach(fetchMock.restore);

  const client = new Client({
    baseUri: 'http://example.com',
  });

  it('should make a successful POST request', () => {
    const body = Client.toBlob({
      username: 'pat@example.com',
      password: 'securepassword',
    });

    return client.post('/success', { body })
      .then(response => response.json())
      .should.eventually.become({ success: true })
      .then(() => fetchMock.lastOptions().body === body).should.eventually.become(true);
  });
});

describe('When handling errors in requests through the client', () => {
  const serverErrorResponse = {
    StatusCode: 500,
    Message: 'Something went horribly, horribly wrong while servicing your request.',
    Details: 'Error details are currently disabled. Please set <code>StaticConfiguration.DisableErrorTraces = false;</code> to enable',
  };

  beforeEach(() => {
    fetchMock
      .get('http://example.com/failure/404', new Response(new Blob(), { status: 404 }))
      .get('http://example.com/failure/500', new Response(Client.toBlob(serverErrorResponse), { status: 500 }))
      .catch(503);
  });
  afterEach(fetchMock.restore);

  const client = new Client({
    baseUri: 'http://example.com',
  });

  it('should deal with an 404 GET request', () =>
    client.get('/failure/404').should.be.rejected.then(x => ({
      isCorrectType: x instanceof NotFoundResponse,
      status: x.status,
    })).should.become({
      isCorrectType: true,
      status: 404,
    }));

  it('should deal with an 500 GET request', () =>
    client.get('/failure/500').should.be.rejected.then(x => ({
      isCorrectType: x instanceof ServerErrorResponse,
      status: x.status,
      message: x.message,
      details: x.details,
    })).should.become({
      isCorrectType: true,
      status: 500,
      message: serverErrorResponse.Message,
      details: serverErrorResponse.Details,
    }));
});
