import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Client from '../Client';
import Tag from './Tag';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a tag based on an object', () => {
  const client = new Client();
  const mockTag = {
    href: '/1/SYNC/tags/1',
    name: 'tag',
  };
  const tag = new Tag(client, mockTag);

  it('should be hydrated', () => tag.hydrated.should.equal(true));
});
