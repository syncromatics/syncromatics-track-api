// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const vehicles = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(vehicles.list), {
        headers: {
          Link: '</1/SYNC/vehicles?page=1&per_page=10&q=12&sort=>; rel="next", </1/SYNC/vehicles?page=1&per_page=10&q=12&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(vehicles.getById(1)));
    const singleAssignmentResponse = () =>
      new Response(Client.toBlob(vehicles.getById(1).assignment));
    const assignmentMutationResponse = () => new Response(undefined);
    const imageResponse = () => {
      const response = new Response(new Blob([255, 254, 253, 252], { type: 'image/jpeg' }));
      response.headers.set('Name', '1');
      return response;
    };
    fetchMock
      .get(client.resolve('/1/SYNC/vehicles?page=1&per_page=10&q=12&sort='), listResponse)
      .get(client.resolve('/1/SYNC/vehicles/1'), singleResponse)
      .get(client.resolve('/1/SYNC/vehicles/1/assignment'), singleAssignmentResponse)
      .put(client.resolve('/1/SYNC/vehicles/1/assignment'), assignmentMutationResponse)
      .delete(client.resolve('/1/SYNC/vehicles/1/assignment'), assignmentMutationResponse)
      .get(client.resolve('/1/SYNC/vehicles/1/media/1'), imageResponse);
  },
  getById: id => vehicles.list.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/vehicles/1',
    id: 1,
    name: '1234',
    enabled: true,
    capacity: 40,
    assignment: {
      vehicle: {
        href: '/1/SYNC/vehicles/1',
      },
      driver: {
        href: '/1/SYNC/drivers/1',
      },
      pattern: {
        href: '/1/SYNC/patterns/1',
      },
      run: {
        href: '/1/SYNC/runs/1',
      },
      trip: {
        href: '/1/SYNC/trips/1',
      },
      start: '2017-01-01T00:00:00.000-07:00',
      sign_in_type: 'Dispatch',
      on_break: false,
    },
    media: [
      {
        href: '/1/SYNC/vehicles/1/media/1',
        contentType: 'image/jpeg',
        name: '1',
      },
      {
        href: '/1/SYNC/vehicles/1/media/2',
        contentType: 'image/jpeg',
        name: '2',
      },
    ],
  }],
};

export default vehicles;
