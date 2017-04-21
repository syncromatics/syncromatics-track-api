import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { charlie, tags as mockTags } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When searching for tags by name', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockTags.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a list of tags', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const tagsPromise = api.customer('SYNC').tags()
      .withQuery('LA') // Tags containing "LA" in their name
      .getPage()
      .then(page => page.list)
      .then(tags => tags); // Do things with list of tags

    return tagsPromise;
  });
});

describe('When retrieving a tag by ID', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockTags.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should get a tag', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const tagPromise = api.customer('SYNC').tag(3)
      .fetch()
      .then(tag => tag); // Do things with tag

    return tagPromise;
  });
});

describe('When creating a tag', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockTags.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should create a tag', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const tagPromise = api.customer('SYNC').tag({ name: 'tagName' })
      .create()
      .then(tag => tag); // Do things with tag

    return tagPromise;
  });
});

describe('When updating a tag', () => {
  const api = new Track({ autoRenew: false });

  beforeEach(() => charlie.setUpSuccessfulMock(api.client));
  beforeEach(() => mockTags.setUpSuccessfulMock(api.client));
  beforeEach(() => fetchMock.catch(503));
  afterEach(fetchMock.restore);

  it('should update a tag', () => {
    api.logIn({ username: 'charlie@example.com', password: 'securepassword' });

    const tagPromise = api.customer('SYNC').tag(3)
      .fetch()
      .then((tag) => {
        // eslint-disable-next-line no-param-reassign
        tag.name = 'updatedTagName';
        return tag.update();
      });

    return tagPromise;
  });
});
