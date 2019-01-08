import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, areas as mockAreas } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When searching for areas by name', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockAreas.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a list of areas', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const areasPromise = api.customer('SYNC').areas()
      .getPage()
      .then(page => page.list)
      .then(areas => areas); // Do things with list of areas

    return areasPromise;
  });
});

describe('When retrieving an area by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockAreas.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get an area', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const areaPromise = api.customer('SYNC').area(1)
      .fetch()
      .then(area => area); // Do things with area

    return areaPromise;
  });
});
