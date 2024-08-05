// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const incidents = {
  setUpSuccessfulMock: (client) => {
    const singleResponse = () => new Response(Client.toBlob({}));

    fetchMock
      .post(client.resolve('/1/SYNC/incidents/1/claim'), singleResponse)
      .post(client.resolve('/1/SYNC/incidents/1/notes'), singleResponse)
      .post(client.resolve('/1/SYNC/incidents/1/dispose'), singleResponse)
      .post(client.resolve('/1/SYNC/incidents/dispose'), singleResponse);
  },
  getById: id => incidents.list.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/incidents/1',
    id: 1,
  }],
};

export default incidents;
