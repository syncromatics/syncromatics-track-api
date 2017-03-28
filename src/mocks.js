// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import { toBlob } from './testutils';

export const charlie = {
  setUpSuccessfulMock: (client) => {
    fetchMock
      .post(client.resolve('/1/login'), () => new Response(toBlob(charlie.token, s => s, 'plain/text')))
      .post(client.resolve('/1/login/renew'), () => new Response(toBlob(charlie.token, s => s, 'plain/text')));
  },
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjMsImZuYW1lIjoiQ2hhcmxpZSIsImxuYW1lIjoiU2luZ2giLCJjdXN0Ijp7IlNZTkMiOiJTeW5jcm9tYXRpY3MifSwicHJpdiI6WyJtYW5hZ2UgdXNlcnMiLCJtYW5hZ2Ugc2ltIGNhcmRzIiwibWFuYWdlIGNlbGx1bGFyIHBsYW5zIiwibWFuYWdlIG1vZGVtcyIsIm1hbmFnZSB2ZWhpY2xlcyIsInRyYWNrIHZlaGljbGVzIiwidmVoaWNsZSBoaXN0b3J5IiwidmVoaWNsZSBzdGF0dXMiLCJtYW5hZ2Ugcm91dGVzIiwibWFuYWdlIHBlcmltZXRlcnMiLCJtb3ZlbWVudCBzaW11bGF0b3IiLCJtYW5hZ2UgYWxlcnRzIiwibWFuYWdlIHBvcnRhbCIsImFsZXJ0IGxvZyIsImNvbnRyb2wgbW9kZW1zIiwiYWNrIGhpc3RvcnkiLCJ3ZWIgbG9nIiwibW9kZW0gc2NyaXB0cyIsImdsb2JhbCBzdGF0dXMiLCJzZXJ2ZXIgbG9nIiwibWFuYWdlIHJvdXRlIHN0b3BzIiwiYXNzaWduIHZlaGljbGVzIiwic3RvcCB0aW1lcyIsInJlcG9ydHMiLCJhY2NvdW50aW5nIiwibWFuYWdlIGFjY291bnRzIiwibWFuYWdlIG1kdHMiLCJtYW5hZ2UgYXBjcyIsImVuZ2luZSBkaWFnbm9zdGljcyIsIm1hbmFnZSBkcml2ZXJzIiwiZmlsZSBkb3dubG9hZHMiLCJidW5jaGluZyIsIkRpc3BhdGNoIiwiTWFuYWdlIFZEIENvbnRyb2xsZXJzIiwiTWFuYWdlIFNpZ25zIiwiVmlzaXRvciBUcmFmZmljIiwiUG9ydGFsIFNlY3VyaXR5IiwiUHJpdmlsZWdlIFRlbXBsYXRlcyIsIkludmVudG9yeSBNYW5hZ2VtZW50IiwiTWFuYWdlIEludm9pY2VzIiwiTWFuYWdlIFF1b3RlcyIsIk1hbmFnZSBSZWNvbmNpbGlhdGlvbiIsIk1hbmFnZSBFbXBsb3llZXMiLCJNRFQgRW1lcmdlbmN5IENvbnRhY3RzIiwiYXZhcyIsIm1hbmFnZSBkZXN0aW5hdGlvbiBzaWduIiwiTWFuYWdlIFNjaGVkdWxlcyJdLCJzdWIiOiJjc2luZ2hAZXhhbXBsZS5jb20iLCJqdGkiOiJjZWJlZDEwNS0yYTVmLTRmOTgtYTVhMi1kZjg1MzJlNzk2NDEiLCJpYXQiOjE0ODU0NTIzODg5MTYsImV4cCI6MTQ4NTQ1MjQ0ODkxNn0.0PNzuAc-QuzcBEYA0mmBMTqADwoH8Dd6mxXlv0FjQhk',
  payload: {
    uid: 3,
    fname: 'Charlie',
    lname: 'Singh',
    cust: {
      SYNC: 'Syncromatics',
    },
    priv: [
      'manage users',
      'manage sim cards',
      'manage cellular plans',
      'manage modems',
      'manage vehicles',
      'track vehicles',
      'vehicle history',
      'vehicle status',
      'manage routes',
      'manage perimeters',
      'movement simulator',
      'manage alerts',
      'manage portal',
      'alert log',
      'control modems',
      'ack history',
      'web log',
      'modem scripts',
      'global status',
      'server log',
      'manage route stops',
      'assign vehicles',
      'stop times',
      'reports',
      'accounting',
      'manage accounts',
      'manage mdts',
      'manage apcs',
      'engine diagnostics',
      'manage drivers',
      'file downloads',
      'bunching',
      'Dispatch',
      'Manage VD Controllers',
      'Manage Signs',
      'Visitor Traffic',
      'Portal Security',
      'Privilege Templates',
      'Inventory Management',
      'Manage Invoices',
      'Manage Quotes',
      'Manage Reconciliation',
      'Manage Employees',
      'MDT Emergency Contacts',
      'avas',
      'manage destination sign',
      'Manage Schedules',
    ],
    sub: 'csingh@example.com',
    jti: 'cebed105-2a5f-4f98-a5a2-df8532e79641',
    iat: 1485452388916,
    exp: 1485452448916,
  },
};

export const routes = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      toBlob(routes.list),
      {
        headers: {
          Link: '</1/SYNC/routes?page=1&perPage=10&q=blue&sort=>; rel="next", </1/SYNC/routes?page=1&perPage=10&q=blue&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(toBlob(routes.getById(1)));

    fetchMock
      .get(client.resolve('/1/SYNC/routes?page=1&perPage=10&q=blue&sort='), listResponse)
      .get(client.resolve('/1/SYNC/routes/1'), singleResponse);
  },
  getById: id => routes.list.find(v => v.id === id),
  list: [
    {
      href: '/1/SYNC/routes/1',
      id: 1,
      name: 'Blue Line',
      short_name: 'Blue',
      description: 'Servicing the Townsville community',
      is_public: true,
      color: '#0000FF',
      text_color: '#FFFFFF',
      patterns: [
        {
          href: '/1/SYNC/patterns/1',
        },
      ],
    },
  ],
};

export const signs = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      toBlob(signs.list),
      {
        headers: {
          Link: '</1/SYNC/signs?page=1&perPage=10&q=first&sort=>; rel="next", </1/SYNC/signs?page=1&perPage=10&q=first&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(toBlob(signs.getById(1)));

    fetchMock
      .get(client.resolve('/1/SYNC/signs?page=1&perPage=10&q=first&sort='), listResponse)
      .get(client.resolve('/1/SYNC/signs/1'), singleResponse);
  },
  getById: id => signs.list.find(v => v.id === id),
  list: [
    {
      href: '/1/SYNC/signs/1',
      id: 1,
      name: 'The first sign',
      enabled: true,
    },
  ],
};

export const stops = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      toBlob(stops.list),
      {
        headers: {
          Link: '</1/SYNC/stops?page=1&perPage=10&q=1st&sort=>; rel="next", </1/SYNC/stops?page=1&perPage=10&q=1st&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(toBlob(stops.getById(1)));

    fetchMock
      .get(client.resolve('/1/SYNC/stops?page=1&perPage=10&q=1st&sort='), listResponse)
      .get(client.resolve('/1/SYNC/stops/1'), singleResponse);
  },
  getById: id => stops.list.find(v => v.id === id),
  list: [
    {
      href: '/1/SYNC/stops/1',
      id: 1,
      name: '1st/Main',
      latitude: 34.081728,
      longitude: -118.351585,
    },
  ],
};

export const vehicles = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      toBlob(vehicles.list),
      {
        headers: {
          Link: '</1/SYNC/vehicles?page=1&perPage=10&q=12&sort=>; rel="next", </1/SYNC/vehicles?page=1&perPage=10&q=12&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(toBlob(vehicles.getById(1)));

    fetchMock
      .get(client.resolve('/1/SYNC/vehicles?page=1&perPage=10&q=12&sort='), listResponse)
      .get(client.resolve('/1/SYNC/vehicles/1'), singleResponse);
  },
  getById: id => vehicles.list.find(v => v.id === id),
  list: [
    {
      href: '/1/SYNC/vehicles/1',
      id: 1,
      name: '1234',
      enabled: true,
      capacity: 40,
      assignment: {
        vehicle: { href: '/1/SYNC/vehicles/1' },
        driver: { href: '/1/SYNC/drivers/1' },
        pattern: { href: '/1/SYNC/patterns/1' },
        run: { href: '/1/SYNC/runs/1' },
        trip: { href: '/1/SYNC/trips/1' },
        start: '2017-01-01T00:00:00.000-07:00',
        sign_in_type: 'Dispatch',
        on_break: false,
      },
    },
  ],
};
