// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const twitter = {
  setUpSuccessfulMock: (client) => {
    const oauthUrl = '/1/SYNC/twitter/oauth';
    const oauthMutationResponse = () => new Response(undefined);

    const usernameUrl = '/1/SYNC/twitter/username';
    const usernameResponse = () => new Response(Client.toBlob({
      href: '/1/SYNC/twitter/username',
      username: 'GMVSYNC',
      is_valid: true,
      profile_image_url: 'https://example.com/gmvsync.png',
    }));

    fetchMock
      .get(client.resolve(usernameUrl), usernameResponse)
      .put(client.resolve(oauthUrl), oauthMutationResponse)
      .delete(client.resolve(oauthUrl), oauthMutationResponse);
  },
};

export default twitter;
