import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from './index';

chai.should();
chai.use(chaiAsPromised);

const mocks = {
  charlie: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjMsImZuYW1lIjoiQ2hhcmxpZSIsImxuYW1lIjoiU2luZ2giLCJjdXN0Ijp7IlNZTkMiOiJTeW5jcm9tYXRpY3MifSwicHJpdiI6WyJtYW5hZ2UgdXNlcnMiLCJtYW5hZ2Ugc2ltIGNhcmRzIiwibWFuYWdlIGNlbGx1bGFyIHBsYW5zIiwibWFuYWdlIG1vZGVtcyIsIm1hbmFnZSB2ZWhpY2xlcyIsInRyYWNrIHZlaGljbGVzIiwidmVoaWNsZSBoaXN0b3J5IiwidmVoaWNsZSBzdGF0dXMiLCJtYW5hZ2Ugcm91dGVzIiwibWFuYWdlIHBlcmltZXRlcnMiLCJtb3ZlbWVudCBzaW11bGF0b3IiLCJtYW5hZ2UgYWxlcnRzIiwibWFuYWdlIHBvcnRhbCIsImFsZXJ0IGxvZyIsImNvbnRyb2wgbW9kZW1zIiwiYWNrIGhpc3RvcnkiLCJ3ZWIgbG9nIiwibW9kZW0gc2NyaXB0cyIsImdsb2JhbCBzdGF0dXMiLCJzZXJ2ZXIgbG9nIiwibWFuYWdlIHJvdXRlIHN0b3BzIiwiYXNzaWduIHZlaGljbGVzIiwic3RvcCB0aW1lcyIsInJlcG9ydHMiLCJhY2NvdW50aW5nIiwibWFuYWdlIGFjY291bnRzIiwibWFuYWdlIG1kdHMiLCJtYW5hZ2UgYXBjcyIsImVuZ2luZSBkaWFnbm9zdGljcyIsIm1hbmFnZSBkcml2ZXJzIiwiZmlsZSBkb3dubG9hZHMiLCJidW5jaGluZyIsIkRpc3BhdGNoIiwiTWFuYWdlIFZEIENvbnRyb2xsZXJzIiwiTWFuYWdlIFNpZ25zIiwiVmlzaXRvciBUcmFmZmljIiwiUG9ydGFsIFNlY3VyaXR5IiwiUHJpdmlsZWdlIFRlbXBsYXRlcyIsIkludmVudG9yeSBNYW5hZ2VtZW50IiwiTWFuYWdlIEludm9pY2VzIiwiTWFuYWdlIFF1b3RlcyIsIk1hbmFnZSBSZWNvbmNpbGlhdGlvbiIsIk1hbmFnZSBFbXBsb3llZXMiLCJNRFQgRW1lcmdlbmN5IENvbnRhY3RzIiwiYXZhcyIsIm1hbmFnZSBkZXN0aW5hdGlvbiBzaWduIiwiTWFuYWdlIFNjaGVkdWxlcyJdLCJzdWIiOiJjc2lnbmhAZXhhbXBsZS5jb20iLCJqdGkiOiJjZWJlZDEwNS0yYTVmLTRmOTgtYTVhMi1kZjg1MzJlNzk2NDEiLCJpYXQiOjE0ODU0NTIzODg5MTYsImV4cCI6MTQ4NTQ1MjQ0ODkxNn0.coRUcA_E4dHOqV5CHOf7NOaGAGwdOEI2cTeOqoCJozs',
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
      sub: 'csignh@example.com',
      jti: 'cebed105-2a5f-4f98-a5a2-df8532e79641',
      iat: 1485452388916,
      exp: 1485452448916,
    },
  },
};

describe('When authenticating', () => {
  beforeEach(() => {
    fetchMock
      .post('https://track-api.syncromatics.com/1/login', {
        body: mocks.charlie.token,
      })
      .catch(503);
  });
  afterEach(fetchMock.restore);

  it('successfully authenticate a valid username and password', () => {
    const api = new Track();

    const promise = api.logIn({
      username: mocks.charlie.payload.sub,
      password: 'securepassword',
    });

    return Promise.all([
      promise.should.eventually.have.property('fname').equal(mocks.charlie.payload.fname),
      promise.should.eventually.have.property('lname').equal(mocks.charlie.payload.lname),
      promise.should.eventually.have.property('cust').deep.equal(mocks.charlie.payload.cust),
    ]);
  });
});
