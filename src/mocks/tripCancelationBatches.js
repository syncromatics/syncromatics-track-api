// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const tripCancelationBatches = {
  setUpSuccessfulMock: (client) => {
    const singleResponse = () => new Response(Client.toBlob(tripCancelationBatches.getById('90892e24-5279-4066-b109-a112925edb89')));
    const postResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/serviceadjustments/cancelations/batches/90892e24-5279-4066-b109-a112925edb89',
      },
    });

    fetchMock
      .get(client.resolve('/1/SYNC/serviceadjustments/cancelations/batches/90892e24-5279-4066-b109-a112925edb89'), singleResponse)
      .post(client.resolve('/1/SYNC/serviceadjustments/cancelations/batches'), postResponse);
  },
  getById: id => tripCancelationBatches.list.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/serviceadjustments/cancelations/batches/90892e24-5279-4066-b109-a112925edb89',
    id: '90892e24-5279-4066-b109-a112925edb89',
    trip_cancelations: [
      { href: '/1/SYNC/serviceadjustments/cancelation/1' },
      { href: '/1/SYNC/serviceadjustments/cancelation/2' },
    ],
  }],
};

export default tripCancelationBatches;
