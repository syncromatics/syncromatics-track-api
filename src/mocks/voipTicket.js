// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const voipTickets = {
  setUpSuccessfulMock: (client, isProvisionKey) => {
    const sync = voipTickets.getByCode('SYNC', isProvisionKey);   

    const singleResponse = () => new Response(Client.toBlob(sync));   

    fetchMock
      .post(client.resolve('/1/SYNC/voip_ticket'), singleResponse);
  },
  getByCode: (code, isProvisionKey) => {
    const sync = voipTickets.list.find(a => a.code === code);
    sync.provision_key = !isProvisionKey ? null : 'provision key'

    return sync;
  },
  list: [{
    href: '/1/SYNC/voip_ticket',
    code: 'SYNC',
    expiration: '2017-06-12T08:00:00-08:00',
    ticket: 'ticket',
    application_key: 'application key',
    provision_key: 'provision key'
  }],
};

export default voipTickets;
