// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const twitterOAuthRequests = {
  setUpSuccessfulMock: (client) => {
    const requestToken = {
      href: '/1/SYNC/twitter/oauth/request',
      redirect_url: 'https://example.com',
      o_auth_token: 'example_token',
    };
    const singleResponse = () => new Response(Client.toBlob(requestToken));

    fetchMock
      .get(client.resolve('/1/SYNC/twitter/oauth/request'), singleResponse);
  },
};

export default twitterOAuthRequests;
