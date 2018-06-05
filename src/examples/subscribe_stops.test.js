import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, realTime as realTimeMocks } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When subscribing to stops', () => {
  let server;
  const api = new Track({
    autoRenew: false,
    reconnectOnClose: false,
    ...realTimeMocks.options,
  });

  before(() => { server = realTimeMocks.getServer(); });
  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));

  afterEach(fetchMock.restore);
  after(() => server.close());

  it('should get updated stops for a single stop', () => {
    const stopHref = '1/SYNC/stops/123';

    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });
    return api.customer('SYNC')
      .realTime()
      .stops()
      .forStop(stopHref)
      .on('update', stop => stop); // do things with stop
  });

  it('should get updated stops for multiple stops', () => {
    const stopHrefs = [
      { href: '1/SYNC/stops/123' },
      { href: '1/SYNC/stops/456' },
      { href: '1/SYNC/stops/789' },
    ];


    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });
    return api.customer('SYNC')
      .realTime()
      .stops()
      .forStops(stopHrefs)
      .on('update', stops => stops); // do things with stops
  });
});
