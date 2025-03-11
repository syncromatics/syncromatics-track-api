import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, detours as mockDetours } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When retrieving a detour by customer', () => {
  const api = new Track({ autoRenew: false });
  
  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockDetours.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get detours', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const detoursPromise = api.customer('SYNC').detours()
      .fetch()
      .then(detours => detours); // Do things with detours 

    return detoursPromise;
  });
});

describe('When creating a detour by customer', () => {
  const api = new Track({ autoRenew: false });
  
  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockDetours.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should should save a detour', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const detoursPromise = api.customer('SYNC').detours()
    .create({
      patternId: 1,
      detourPatternId: 2,
      title: "Main Street Closure",
      shouldMatchScheduledStops: true,
      startDateTime: new Date('2023-01-01T09:00:00Z'),
      endDateTime: new Date('2023-01-15T17:00:00Z'),
    });

    return detoursPromise; 
  })
});

describe('When deactivating a detour by customer', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockDetours.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should deactivate a detour', async () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const detourId = 2;
    const detoursPromise = api.customer('SYNC').detours()
      .deactivate(detourId);

    return detoursPromise;
  });
});

describe('When retrieving historical detours by customer', () => {
  const api = new Track({ autoRenew: false });
  
  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockDetours.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get all historical detours without date parameters', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const detoursPromise = api.customer('SYNC').detours()
      .getHistoricalDetours()
      .then(detours => {
        detours.should.be.an('array');
      });

    return detoursPromise;
  });

  it('should get historical detours with start date parameter', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const startDate = new Date('2024-01-01T00:00:00Z');
    const detoursPromise = api.customer('SYNC').detours()
      .getHistoricalDetours(startDate)
      .then(detours => {
        detours.should.be.an('array');
      });

    return detoursPromise;
  });

  it('should get historical detours with start and end date parameters', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const startDate = new Date('2024-01-01T00:00:00Z');
    const endDate = new Date('2024-02-01T00:00:00Z');
    const detoursPromise = api.customer('SYNC').detours()
      .getHistoricalDetours(startDate, endDate)
      .then(detours => {
        detours.should.be.an('array');
      });

    return detoursPromise;
  });
});