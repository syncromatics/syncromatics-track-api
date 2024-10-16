import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, patterns as mockPatterns } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When creating a new detour pattern', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockPatterns.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should create a new detour pattern', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });
    const patternPayload = {
      "longName": "Example detour pattern",
      "shortName": "EDP",
      "description": "This is an example of creating a detour pattern with a new stop, a waypoint and an existing stop.",
      "originalPatternId": 23324,
      "waypoints": [
        {
          "latitude": 34.052235,
          "longitude": -118.243683,
          "name": "Stop 1 - Downtown",
          "isStop": true, //set to true
          "wheelchairBoarding": true,
          "order": 0
        },
        {
          "latitude": 34.052336,
          "longitude": -118.243584,
          "order": 10
        },
        {
          "stopId": 9329875,
          "latitude": 34.052437,
          "longitude": -118.243485,
          "isStop": true,
          "wheelchairBoarding": false,
          "order": 20
        }
      ]
    };
    fetchMock.post('/1/SYNC/patterns/detour', {
      status: 201,
      body: patternPayload,
    });

    const createPatternPromise = api.customer('SYNC').patterns()
        .createDetourPattern(patternPayload)
        .then(createPatternResponse => {
          createPatternResponse.should.be.an('object');
        });
    return createPatternPromise;
  });
});