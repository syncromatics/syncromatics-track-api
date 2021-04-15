// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const riderAppConfiguration = {
  rawObject: {
    href: '/1/SYNC/rider_app_configuration',
    splash_image_url: 'https://example.com/logo.png',
    accent_color: '#ABCDEF',
    information: [{
      title: 'Agency Information',
      items: [
        {
          title: 'About Us',
          link: 'https://example.com/about',
        },
        {
          title: 'Routes',
          link: 'https://example.com/routes',
        },
      ],
    }],
  },
  setUpSuccessfulMock: (client) => {
    const url = client.resolve('/1/SYNC/rider_app_configuration');

    const putResponse = () => new Response(undefined);
    const getResponse = () => new Response(Client.toBlob(riderAppConfiguration.rawObject));

    fetchMock
      .put(url, putResponse)
      .get(url, getResponse);
  }
};

export default riderAppConfiguration;
