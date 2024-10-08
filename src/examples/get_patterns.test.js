import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, patterns as mockPatterns } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When searching for patterns by name', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockPatterns.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a list of patterns', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const patternsPromise = api.customer('SYNC').patterns()
      .withQuery('blue') // patterns containing "blue" in their name
      .getPage()
      .then(page => page.list)
      .then(patterns => patterns); // Do things with list of patterns

    return patternsPromise;
  });
});

describe('When searching for patterns that are enabled for operations', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockPatterns.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a list of patterns', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const asOf = new Date('05 March 2018 00:00 UTC');
    const patternsPromise = api.customer('SYNC').patterns()
      .withEnabledForOperations()
      .withAsOf(asOf)
      .getPage()
      .then(page => page.list)
      .then(patterns => patterns); // Do things with list of patterns

    return patternsPromise;
  });
});

describe('When getting a collection of patterns with their associated stop information', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockPatterns.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a list of patterns', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const patternsPromise = api.customer('SYNC').patterns()
      .withExpandedProperty('stops')
      .getPage()
      .then(page => page.list)
      .then(patterns => patterns); // Do things with list of patterns

    return patternsPromise;
  });

  it('should respect withAsOf and withEnabledForOperations', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const asOf = new Date('05 March 2018 00:00 UTC');
    const patternsPromise = api.customer('SYNC').patterns()
      .withExpandedProperty('stops')
      .withEnabledForOperations()
      .withAsOf(asOf)
      .getPage()
      .then(page => page.list)
      .then(patterns => patterns); // Do things with list of patterns

    return patternsPromise;
  });
});

describe('When retrieving a pattern by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockPatterns.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a pattern', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const patternsPromise = api.customer('SYNC').pattern(1)
      .fetch()
      .then(pattern => pattern); // Do things with pattern

    return patternsPromise;
  });

  it('should get a pattern with expanded stops', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const patternsPromise = api.customer('SYNC').pattern(1, { expandStops: true })
      .fetch()
      .then(pattern => pattern); // Do things with pattern

    return patternsPromise;
  });

  it('should get a pattern with expanded route', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const patternsPromise = api.customer('SYNC').pattern(1, { expandRoute: true })
      .fetch()
      .then(pattern => pattern); // Do things with pattern

    return patternsPromise;
  });

  it('should get a pattern with expanded stops and route', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const patternsPromise = api.customer('SYNC').pattern(1, { expandStops: true, expandRoute: true })
      .fetch()
      .then(pattern => pattern); // Do things with pattern

    return patternsPromise;
  });
});