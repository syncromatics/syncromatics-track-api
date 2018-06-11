// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const settings = {
  setUpSuccessfulMock: (client) => {
    const singleResponse = () => new Response(Client.toBlob(settings.get()));

    fetchMock
      .get(client.resolve('/1/SYNC/settings'), singleResponse);
  },
  get: () => settings.object,
  object: {
    href: '/1/SYNC/settings',
    sign_in_type: 'trip',
  },
};

export default settings;
