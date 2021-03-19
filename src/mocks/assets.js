// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const assets = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(assets.list), {
        headers: {
          Link: '</1/SYNC/assets?page=1&per_page=10&sort=>; rel="next", </1/SYNC/assets?page=1&per_page=10&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(assets.getById(1)));
    const postResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/assets/1',
      },
    });
    const patchResponse = () => new Response(undefined, {
      headers: {},
    });

    fetchMock
      .get(client.resolve('/1/SYNC/assets?page=1&per_page=10&sort='), listResponse)
      .get(client.resolve('/1/SYNC/assets/1'), singleResponse)
      .post(client.resolve('/1/SYNC/assets'), postResponse)
      .patch(client.resolve('/1/SYNC/assets/1'), patchResponse);
  },
  getById: id => assets.list.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/assets/1',
    id: 1,
    is_saved: true,
    url: "http://example.com/file.png",
    asset_type: "Logo",
  }],
};

export default assets;
