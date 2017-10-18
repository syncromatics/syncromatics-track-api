import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import RealTimeContext from './RealTimeContext';

chai.should();
chai.use(chaiAsPromised);

const mockClient = { startSubscription: () => {} };
const someEntity = 'entity';

describe('When resolving hrefs', () => {
  it('should handle resource objects', () => {
    const expected = '1/SYNC/vehicles/123';
    const resource = { href: expected };
    const actual = RealTimeContext.resolveHref(resource);
    actual.should.equal(expected);
  });

  it('should handle straight hrefs', () => {
    const expected = '1/SYNC/vehicles/123';
    const actual = RealTimeContext.resolveHref(expected);
    actual.should.equal(expected);
  });

  it('should refuse to resolve non-conforming inputs', () => {
    const weirdInput = { foo: 'bar' };
    const attempt = () => RealTimeContext.resolveHref(weirdInput);
    attempt.should.throw(Error);
  });
});

describe('When asserting a subscription has not started', () => {
  it('should throw an error if a subscription has been started', () => {
    const subject = new RealTimeContext(mockClient, someEntity);
    subject.on('update', () => {});

    const attempt = () => subject.assertSubscriptionNotStarted();
    attempt.should.throw(Error);
  });

  it('should not throw an error if no subscription has been started', () => {
    const subject = new RealTimeContext(mockClient, someEntity);

    const attempt = () => subject.assertSubscriptionNotStarted();
    attempt.should.not.throw(Error);
  });
});

describe('When adding a subscription', () => {
  it('should accept subscriptions to update events', () => {
    const subject = new RealTimeContext(mockClient, someEntity);
    const attempt = () => subject.on('update', () => {});
    attempt.should.not.throw(Error);
  });

  it('should accept subscriptions to delete events', () => {
    const subject = new RealTimeContext(mockClient, someEntity);
    const attempt = () => subject.on('delete', () => {});
    attempt.should.not.throw(Error);
  });

  it('should not accept subscriptions to other events', () => {
    const subject = new RealTimeContext(mockClient, someEntity);
    const attempt = () => subject.on('other', () => {});
    attempt.should.throw(Error);
  });
});
