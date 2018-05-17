import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Client from '../Client';
import DispatchMessage from './DispatchMessage';

import { dispatchMessages as mocks } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a dispatch message based on customer and ID', () => {
  const client = new Client();
  const dispatchMessage = new DispatchMessage(client, DispatchMessage.makeHref('SYNC', 1));
  it('should set the href', () => dispatchMessage.href.should.equal('/1/SYNC/dispatch_messages/1'));
  it('should not be hydrated', () => dispatchMessage.hydrated.should.equal(false));
});

describe('When instantiating a dispatch message based on an object', () => {
  const client = new Client();
  const dispatchMessage = new DispatchMessage(client, mocks.getById(3));

  it('should set the ID', () => dispatchMessage.id.should.equal(3));
  it('should set the href', () => dispatchMessage.href.should.equal('/1/SYNC/dispatch_messages/3'));
  it('should be hydrated', () => dispatchMessage.hydrated.should.equal(true));
});

describe('When fetching a dispatch message based on customer and ID', () => {
  const client = new Client();

  beforeEach(() => mocks.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  beforeEach(() => {
    promise = new DispatchMessage(client, DispatchMessage.makeHref('SYNC', 3)).fetch();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(x => x.id).should.eventually.equal(3));
  it('should set the href', () => promise.then(x => x.href).should.eventually.equal('/1/SYNC/dispatch_messages/3'));
  it('should be hydrated', () => promise.then(x => x.hydrated).should.eventually.equal(true));
});

describe('When creating a dispatch message', () => {
  const client = new Client();

  beforeEach(() => mocks.setUpSuccessfulMock(client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  let promise;
  const message = 'Some radio chatter';
  beforeEach(() => {
    promise = new DispatchMessage(client, { code: 'SYNC',
      ...{
        vehicle: { href: '/1/SYNC/vehicles/1' },
        driver: { href: '/1/SYNC/drivers/1' },
        at_time: '2017-01-01T00:00:00.000-07:00',
        message_direction: 'FromDispatch',
        pattern: { href: '/1/SYNC/patterns/1' },
        dispatch_user: { href: '/1/users/1' },
        customerId: 1,
        message,
      },
    }).create();
  });

  it('should resolve the promise', () => promise.should.be.fulfilled);
  it('should set the ID', () => promise.then(x => x.id).should.eventually.equal(3));
  it('should set the href', () => promise.then(x => x.href).should.eventually.equal('/1/SYNC/dispatch_messages/3'));
  it('should set the message', () => promise.then(x => x.message).should.eventually.equal(message));
  it('should be hydrated', () => promise.then(x => x.hydrated).should.eventually.equal(true));
});
