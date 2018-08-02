// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const voipTickets = {
  setUpSuccessfulMock: (client) => {
    const sync = voipTickets.getByCode('SYNC');
    const singleResponse = () => new Response(Client.toBlob(sync));

    fetchMock
      .get(client.resolve('/1/SYNC/voip_ticket'), singleResponse);
  },
  getByCode: code => voipTickets.list.find(a => a.code === code),
  list: [{
    href: '/1/SYNC/voip_ticket',
    code: 'SYNC',
    expiration: '2017-06-12T08:00:00-08:00',
    ticket: 'ticket',
    application_key: 'application key',
  }],
};

export default voipTickets;
