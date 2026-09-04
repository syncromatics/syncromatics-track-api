import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import UserMessagesRealTimeContext from './UserMessagesRealTimeContext';
import Client from '../Client';
import RealTimeClient from '../RealTimeClient';
import { realTime as mock, userMessages } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

const readBlob = blob => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsText(blob);
});

describe('When subscribing to User Messages', () => {
  const customerCode = 'SYNC';

  afterEach(fetchMock.restore);

  const createSubject = (options = {}) => {
    const realTimeClient = new RealTimeClient(mock.authenticatedClient, mock.options);
    return {
      realTimeClient,
      subject: new UserMessagesRealTimeContext(realTimeClient, customerCode, options),
    };
  };

  it('subscribes to all rooms when no room is named', () => {
    const server = mock.getServer();
    const { realTimeClient, subject } = createSubject();
    subject.on('update', () => {});

    return server.verifySubscription('ROOM_MESSAGES', {
      closeConnection: true,
      realTimeClient,
    }).should.eventually.deep.equal({ rooms: [] });
  });

  it('can filter by one room', () => {
    const server = mock.getServer();
    const { realTimeClient, subject } = createSubject();
    const room = '/1/SYNC/room_messages/397';
    subject.forRoom(room).on('update', () => {});

    return server.verifySubscription('ROOM_MESSAGES', {
      closeConnection: true,
      realTimeClient,
    }).should.eventually.deep.equal({ rooms: [room] });
  });

  it('can filter by multiple rooms and Resource-like objects', () => {
    const server = mock.getServer();
    const { realTimeClient, subject } = createSubject();
    const rooms = ['/1/SYNC/room_messages/397', '/1/SYNC/room_messages/403'];
    subject.forRooms([rooms[0], { href: rooms[1] }]).on('update', () => {});

    return server.verifySubscription('ROOM_MESSAGES', {
      closeConnection: true,
      realTimeClient,
    }).should.eventually.deep.equal({ rooms });
  });

  it('passes server message fields through unchanged', () => {
    const server = mock.getServer();
    const { realTimeClient, subject } = createSubject();
    let resolver;
    const updateReceived = new Promise((resolve) => { resolver = resolve; });

    subject.on('update', resolver);

    return updateReceived
      .then((response) => {
        response.data.should.deep.equal(userMessages.list);
        response.data[0].should.have.property('room_href');
        response.data[0].should.not.have.property('seen');
        response.data[1].should.have.property('seen');
      })
      .then(() => server.closeConnection(realTimeClient));
  });

  it('does not allow filters after subscribing', () => {
    const server = mock.getServer();
    const { realTimeClient, subject } = createSubject();
    subject.on('update', () => {});
    (() => subject.forRoom('/1/SYNC/room_messages/397')).should.throw();
    server.closeConnection(realTimeClient);
  });

  it('creates a message and returns the unchanged server response', () => {
    const client = new Client();
    const realTimeClient = new RealTimeClient(client);
    const message = "Chris to cooper's room";
    userMessages.setUpSuccessfulMock(client, { message });
    const subject = new UserMessagesRealTimeContext(
      realTimeClient,
      customerCode,
      { platformType: 2 },
    ).forRoom('/1/SYNC/room_messages/397');

    return subject.send(message).then((created) => {
      created.should.have.property('room_href', '/1/SYNC/room_messages/397');
      created.should.have.property('author_first_name', 'Chris');
      fetchMock.lastUrl().should.equal(client.resolve('/1/SYNC/room_messages', {
        roomId: 397,
        message,
        platformType: 2,
      }));
    });
  });

  it('requires one room and a configured platform type to send', () => {
    const { subject } = createSubject();
    const withoutPlatform = createSubject().subject.forRoom('/1/SYNC/room_messages/397');
    return Promise.all([
      subject.send('message').should.be.rejected,
      withoutPlatform.send('message').should.be.rejected,
    ]);
  });

  it('validates platform type', () => {
    const realTimeClient = new RealTimeClient(new Client());
    (() => new UserMessagesRealTimeContext(
      realTimeClient,
      customerCode,
      { platformType: 3 },
    )).should.throw();
  });

  it('marks numeric message IDs read', () => {
    const client = new Client();
    userMessages.setUpSuccessfulMock(client);
    const subject = new UserMessagesRealTimeContext(
      new RealTimeClient(client),
      customerCode,
    );

    return subject.markMessagesRead([1, 2, 3]).then(() => {
      fetchMock.lastUrl().should.equal(
        client.resolve('/1/SYNC/room_messages/read-receipts'),
      );
      return readBlob(fetchMock.lastOptions().body);
    }).then(body => JSON.parse(body).should.deep.equal([1, 2, 3]));
  });

  it('rejects invalid read receipt payloads', () => {
    const { subject } = createSubject();
    return subject.markMessagesRead([1, '2']).should.be.rejected;
  });
});
