import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { creators } from './messages';

chai.should();
chai.use(chaiAsPromised);

const areAllUnique = (array) => {
  const sortedArray = array.slice().sort();
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < sortedArray.length - 1; i++) {
    if (sortedArray[i] === sortedArray[i + 1]) return false;
  }
  return true;
};

describe('When creating messages for the realtime API', () => {
  it('should generate a unique request ID each time', () => {
    const requests = [
      creators.createAuthRequest('some jwt'),
      creators.createAuthRequest('duplicate jwt'),
      creators.createAuthRequest('duplicate jwt'),
      creators.createSubscriptionRequest('assignments', 'SYNC'),
      creators.createSubscriptionRequest('assignments', 'SYNC'),
      creators.createSubscriptionRequest('assignments', 'SYNC'),
      creators.createSubscriptionRequest('stoptimes', 'SYNC'),
    ];
    const requestIds = requests.map(x => x.request_id);
    areAllUnique(requestIds).should.equal(true);
  });
});
