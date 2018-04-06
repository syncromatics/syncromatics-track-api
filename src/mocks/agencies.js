// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const agencies = {
  setUpSuccessfulMock: (client) => {
    const sync = agencies.getByCode('SYNC');
    const singleResponse = () => new Response(Client.toBlob(sync));
    const putResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC',
      },
    });

    fetchMock
      .get(client.resolve('/1/SYNC'), singleResponse)
      .put(client.resolve('/1/SYNC'), putResponse);
  },
  getByCode: code => agencies.list.find(a => a.code === code),
  list: [{
    href: '/1/SYNC',
    code: 'SYNC',
    name: 'Syncromatics Transit Agency',
    agency_url: 'https://www.syncromatics.com/',
    agency_phone: '310.728.6997',
    agency_fare_url: 'https://www.syncromatics.com/about/',
    agency_email: 'info@syncromatics.com',
  }],
};

export default agencies;
