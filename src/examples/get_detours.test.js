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

    return detoursPromise; // List of detours that includes newly created detour
  })
});