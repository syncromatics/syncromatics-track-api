import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { tripCancelations as mockTripCancelations } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When retrieving a list of users', () => {
  const api = new Track({ autoRenew: false });
  
  beforeEach(() => mockTripCancelations.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should find a list of tripCancelations', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const tcPromise = api.customer('SYNC')
      .tripCancelations()
      .getPage()
      .then(page => page.list)
      .then(tripCancelations => tripCancelations); // Do things with cancelations

    return tcPromise;
  });
});

// describe('When creating a trip cancelation', () => {
//   const api = new Track({ autoRenew: false });
//
//   beforeEach(() => charlie.setUpSuccessfulMock(api.client));
//   beforeEach(() => mockUsers.setUpSuccessfulMock(api.client));
//   beforeEach(() => fetchMock.catch(503));
//   afterEach(fetchMock.restore);
//
//   it('should create a user', () => {
//     api.logIn({ username: 'charlie@example.com', password: 'securepassword' });
//
//     const userPromise = api
//       .user({
//         firstName: 'Charlie',
//         lastName: 'Singh',
//       })
//       .create()
//       .then(user => user); // Do things with user
//
//     return userPromise;
//   });
// });
