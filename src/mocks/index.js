// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

export { default as agencies } from './agencies';
export { default as areas } from './areas';
export { default as assets } from './assets';
export { default as assignableRoutes } from './assignableRoutes';
export { default as assignableStops } from './assignableStops';
export { default as blocks } from './blocks';
export { default as calls } from './calls';
export { default as callParticipants } from './callParticipants';
export { default as dispatchMessages } from './dispatchMessages';
export { default as dispatchMessageBatches } from './dispatchMessageBatches';
export { default as dispatchMessageStatus } from './dispatchMessageStatus';
export { default as drivers } from './drivers';
export { default as externalApis } from './externalApis';
export { default as incidents } from './incidents';
export { default as messages } from './messages';
export { default as messageChannels } from './messageChannels';
export { default as patterns } from './patterns';
export { default as reportingTickets } from './reportingTickets';
export { default as realTime } from './realTime';
export { default as riderAppConfiguration } from './riderAppConfiguration';
export { default as roles } from './roles';
export { default as routes } from './routes';
export { default as runs } from './runs';
export { default as servicePackages } from './servicePackages';
export { default as services } from './services';
export { default as signs } from './signs';
export { default as stops } from './stops';
export { default as tags } from './tags';
export { default as trips } from './trips';
export { default as twitter } from './twitter';
export { default as twitterOAuthRequests } from './twitterOAuthRequests';
export { default as users } from './users';
export { default as vehicles } from './vehicles';
export { default as voipTickets } from './voipTicket';

export const charlie = {
  setUpSuccessfulMock: (client) => {
    fetchMock
      .post(client.resolve('/1/login'), () => new Response(Client.toBlob(charlie.token, s => s, 'text/plain')))
      .post(client.resolve('/1/login/renew'), () => new Response(Client.toBlob(charlie.token, s => s, 'text/plain')));
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

