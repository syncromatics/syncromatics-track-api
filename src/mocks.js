/* eslint-disable import/no-extraneous-dependencies */
import fetchMock from 'fetch-mock';
import {
  Server
} from 'mock-socket';
/* eslint-enable import/no-extraneous-dependencies */
import Client from './Client';
import * as messages from './subscriptions/messages';

export const charlie = {
  setUpSuccessfulMock: (client) => {
    fetchMock
      .post(client.resolve('/1/login'), () => new Response(Client.toBlob(charlie.token, s => s, 'plain/text')))
      .post(client.resolve('/1/login/renew'), () => new Response(Client.toBlob(charlie.token, s => s, 'plain/text')));
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

export const agencies = {
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
  }, ],
};

export const externalApis = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(externalApis.list), {
        headers: {
          Link: '</1/external_apis?page=1&per_page=10&q=arr&sort=>; rel="next", </1/external_apis?page=1&per_page=10&q=arr&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(externalApis.getById(1)));

    fetchMock
      .get(client.resolve('/1/external_apis?page=1&per_page=10&q=arr&sort='), listResponse)
      .get(client.resolve('/1/external_apis/1'), singleResponse);
  },
  getById: id => externalApis.list.find(e => e.id === id),
  list: [{
    id: 1,
    name: 'arrivals',
    description: 'upcoming arrivals',
    href: '/1/external_apis/1',
  }, ],
};

export const messageTemplates = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(messageTemplates.list), {
        headers: {
          Link: '</1/SYNC/message_templates?page=1&per_page=10&q=5k&sort=>; rel="next", </1/SYNC/message_templates?page=1&per_page=10&q=5k&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(messageTemplates.getById(1)));
    const createResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/message_templates/1',
      },
    });

    fetchMock
      .get(client.resolve('/1/SYNC/message_templates?page=1&per_page=10&q=5k&sort='), listResponse)
      .get(client.resolve('/1/SYNC/message_templates/1'), singleResponse)
      .post(client.resolve('/1/SYNC/message_templates'), createResponse)
      .put(client.resolve('/1/SYNC/message_templates/1'), createResponse);
  },
  getById: id => messageTemplates.list.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/message_templates/1',
    id: 1,
    name: '5k Detour',
    text: 'Due to the 5k Race, buses will detour off Figueroa from 6pm to 11am on 2/15/17. Find northbound buses on Hope, southbound buses on Flower.',
    start: '2017-02-12T08:00:00-08:00',
    end: '2017-02-15T11:00:00-08:00',
    manual_archive_date: null,
    sign_messages: [{
      id: 1,
      override_text: 'Due to the 5k, buses will be on detour.',
      schedules: [{
        day_of_week: 1,
        start: '06:00:00',
        end: '18:00:00',
      }, ],
      tags: [{
        href: '/1/SYNC/tags/1',
      }, ],
      routes: [{
        href: '/1/SYNC/routes/1',
      }, ],
      stops: [{
        href: '/1/SYNC/stops/1',
      }, ],
      signs: [{
        href: '/1/SYNC/signs/1',
      }, ],
    }, ],
  }, ],
};

export const routes = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(routes.list), {
        headers: {
          Link: '</1/SYNC/routes?page=1&per_page=10&q=blue&sort=>; rel="next", </1/SYNC/routes?page=1&per_page=10&q=blue&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(routes.getById(1)));

    fetchMock
      .get(client.resolve('/1/SYNC/routes?page=1&per_page=10&q=blue&sort='), listResponse)
      .get(client.resolve('/1/SYNC/routes/1'), singleResponse);
  },
  getById: id => routes.list.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/routes/1',
    id: 1,
    name: 'Blue Line',
    short_name: 'Blue',
    description: 'Servicing the Townsville community',
    is_public: true,
    color: '#0000FF',
    text_color: '#FFFFFF',
    patterns: [{
      href: '/1/SYNC/patterns/1',
    }, ],
  }, ],
};

export const patterns = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(patterns.list.map(pattern => ({
        ...pattern,
        stops: patterns.patternStopReferences,
      }))), {
        headers: {
          Link: '</1/SYNC/patterns?page=1&per_page=10&q=blue&sort=>; rel="next", </1/SYNC/patterns?page=1&per_page=10&q=blue&sort=>; rel="last"',
        },
      });
    const listResponseWithStops = () => new Response(
      Client.toBlob(patterns.list.map(pattern => ({
        ...pattern,
        stops: patterns.patternStops,
      }))), {
        headers: {
          Link: '</1/SYNC/patterns?page=1&per_page=10&q=blue&sort=>; rel="next", </1/SYNC/patterns?page=1&per_page=10&q=blue&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(patterns.getById(1)));

    fetchMock
      .get(client.resolve('/1/SYNC/patterns?page=1&per_page=10&q=blue&sort='), listResponse)
      .get(client.resolve('/1/SYNC/patterns?page=1&per_page=10&expand=stops&sort='), listResponseWithStops)
      .get(client.resolve('/1/SYNC/patterns/1'), singleResponse);
  },
  getById: id => patterns.list
    .map(p => ({ ...p,
      stops: patterns.patternStopReferences
    }))
    .find(p => p.id === id),
  list: [{
    id: 1,
    route: {
      href: '/1/SYNC/routes/1',
    },
    name: 'anttest',
    short_name: "a's'l",
    description: 'test',
    color: '#4DB8FF',
    text_color: '#FF142C',
    length: 28356.700271064834,
    direction_type: 'Loop',
    encoded_polyline: 'miaoElhmqUeDlA??gDlA??aBl@v@mE??v@mE??x@mE??v@mE??v@mE??x@mE??v@mE??r@wDyA}D??wA{D??yA{D??wA}D??wA{D??{@}BPwE??NwE??PwE??NwE??NwE??PwE??NwE??PwE??NwE??PwE??NwE??NwE??PwE??NwE??PwE??NwE??PwE??NwE??NwE??PwE??NwE??PwE??NwE??PwE??NwE??PwE??NwE??NwE??JgCAwE??AyE??AwE??CyE??AwE??AyE??AwE??AyE??jAcE??|BrBd@`Ao@qE??o@oE??q@qE??i@{DLwE??NwE??BaAnDj@??nDj@??nDj@??nDj@??nDl@??nDj@??nDj@??nDj@??nDj@??vCd@AyE??sDI??sD@??EwE??pDE??rD???CyEsDO??qD???EyE??pDKrDA??DyE???G??qD@??sD???t@iE~@iE??~@kE??~@iE??~@iE??~@iE??`AkE??~@iE??~@iE??~@kE??~@iE??~@iE??`AiE??~@kE??~@iE??~@iE??~@iE??~@kE??~@iE??`AiE??~@kE??~@iE??~@iE??~@iE??~@kE??~@iE??`AiE??~@iE??~@kE??~@iE??~@iE??~@iE??r@cDxA{D??xA{D??xA{D??xA{D??xA{D??xA{D??xA{D??xA{D??vA{D??xA{D??xA{D??xA{D??xA{D??xA{D??xAyD??xA{D??xA{D??vA{D??xA{D??xA{D??xA{D??xA{D??xA{D??bAmCbCrC??`CrC??bCrC??bCrC??`CrC??bCrC??bCrC??`CrC??bCrC??bCrC??`CrC??bCrC??`CpCuB`D??wB`D??wB`D??uB`D??wB`D??uAtByAxD??yAzD??{AzD??yAzD??yAxD??yAzD??yAzD??{AxD??yAzD??yAzD??yAzD??yAxD??q@pE??e@rEIt@c@rE??e@tE??c@rE??c@rE??c@rE??c@rE??e@tE??c@rE??c@rE??c@rE??c@rE??e@tE??c@rE??c@rE??c@rE??c@rE??e@rE??c@tE??c@rE??c@rE??c@rE??e@rE??c@tE??c@rE??c@rE??c@rE??e@rE??c@tE??c@rE??c@rE??]lD??wB~C??wB~C??yB`D??wB~C??wB`D??yB~C??wB`D??wB~C??sBzCbBpD??dBrD??bBrD??bBrD??dBpD??bBrD??dBrD??bBpD??dBrD??bBrD??fA~B??@vE???xE??@vE???xE??@vE??@xE???vE??@vE???xE??@vE??@xE???vE??DxE??BvE?DDxE??BvE??DxE??@dC??c@rE??c@rE??e@rE??c@tE??c@rE??e@rE??c@rE??c@rE??e@rE??c@tE??c@rE??e@rE??c@rE??c@rE??c@rE??e@tE??c@rE??c@rE??e@rE??MtAqDX??qDZ??sDX??qDZ??qDX??qDZ??cAHsDD??qDF??sDF??sDD??sDF??sDF??kDDsDC??sDE??sDE??sDE??qDC??sDE??m@A',
    href: '/1/SYNC/patterns/1',
  }, ],
  patternStopReferences: [{
      href: '/1/SYNC/patterns_stops/11652',
    },
    {
      href: '/1/SYNC/patterns_stops/11659',
    },
    {
      href: '/1/SYNC/patterns_stops/11662',
    },
    {
      href: '/1/SYNC/patterns_stops/11648',
    },
    {
      href: '/1/SYNC/patterns_stops/11649',
    },
    {
      href: '/1/SYNC/patterns_stops/11668',
    },
  ],
  patternStops: [{
      href: '/1/SYNC/patterns_stops/11652',
      stop: {
        href: '/1/SYNC/stops/1',
      },
      pattern: {
        href: '/1/SYNC/routes/1',
      },
      distance_along_line: 1.23456789,
      stop_order: 1,
      rtpi_number: 1001,
    },
    {
      href: '/1/SYNC/patterns_stops/11659',
      stop: {
        href: '/1/SYNC/stops/1',
      },
      pattern: {
        href: '/1/SYNC/routes/1',
      },
      distance_along_line: 1.23456789,
      stop_order: 2,
      rtpi_number: 1002,
    },
    {
      href: '/1/SYNC/patterns_stops/11662',
      stop: {
        href: '/1/SYNC/stops/1',
      },
      pattern: {
        href: '/1/SYNC/routes/1',
      },
      distance_along_line: 1.23456789,
      stop_order: 3,
      rtpi_number: 1003,
    },
    {
      href: '/1/SYNC/patterns_stops/11648',
      stop: {
        href: '/1/SYNC/stops/1',
      },
      pattern: {
        href: '/1/SYNC/routes/1',
      },
      distance_along_line: 1.23456789,
      stop_order: 4,
      rtpi_number: 1004,
    },
    {
      href: '/1/SYNC/patterns_stops/11649',
      stop: {
        href: '/1/SYNC/stops/1',
      },
      pattern: {
        href: '/1/SYNC/routes/1',
      },
      distance_along_line: 1.23456789,
      stop_order: 5,
      rtpi_number: 1005,
    },
    {
      href: '/1/SYNC/patterns_stops/11668',
      stop: {
        href: '/1/SYNC/stops/1',
      },
      pattern: {
        href: '/1/SYNC/routes/1',
      },
      distance_along_line: 1.23456789,
      stop_order: 6,
      rtpi_number: 1006,
    },
  ],
};

export const signs = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(signs.list), {
        headers: {
          Link: '</1/SYNC/signs?page=1&per_page=10&q=first&sort=>; rel="next", </1/SYNC/signs?page=1&per_page=10&q=first&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(signs.getById(1)));

    fetchMock
      .get(client.resolve('/1/SYNC/signs?page=1&per_page=10&q=first&sort='), listResponse)
      .get(client.resolve('/1/SYNC/signs/1'), singleResponse);
  },
  getById: id => signs.list.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/signs/1',
    id: 1,
    name: 'The first sign',
    enabled: true,
  }, ],
};

export const stops = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(stops.list), {
        headers: {
          Link: '</1/SYNC/stops?page=1&per_page=10&q=1st&sort=>; rel="next", </1/SYNC/stops?page=1&per_page=10&q=1st&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(stops.getById(1)));
    const postResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/stops/1',
      },
    });
    const putResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/stops/1',
      },
    });

    fetchMock
      .get(client.resolve('/1/SYNC/stops?page=1&per_page=10&q=1st&sort='), listResponse)
      .get(client.resolve('/1/SYNC/stops/1'), singleResponse)
      .post(client.resolve('/1/SYNC/stops'), postResponse)
      .put(client.resolve('/1/SYNC/stops/1'), putResponse);
  },
  getById: id => stops.list.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/stops/1',
    id: 1,
    name: '1st/Main',
    latitude: 34.081728,
    longitude: -118.351585,
  }, ],
};

export const tags = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(tags.list), {
        headers: {
          Link: '</1/SYNC/tags?page=1&per_page=10&q=LA&sort=>; rel="next", </1/SYNC/tags?page=1&per_page=10&q=LA&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(tags.getById(3)));
    const postResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/tags/3',
      },
    });
    const putResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/tags/3',
      },
    });

    fetchMock
      .get(client.resolve('/1/SYNC/tags?page=1&per_page=10&q=LA&sort='), listResponse)
      .get(client.resolve('/1/SYNC/tags/3'), singleResponse)
      .post(client.resolve('/1/SYNC/tags'), postResponse)
      .put(client.resolve('/1/SYNC/tags/3'), putResponse);
  },
  getById: id => tags.list.find(v => v.id === id),
  list: [{
    href: '/1/SYNC/tags/3',
    id: 3,
    name: 'DTLA',
    customerId: 1,
  }, ],
};

export const users = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(users.list), {
        headers: {
          Link: '</1/users?page=1&per_page=10&q=1st&sort=>; rel="next", </1/users?page=1&per_page=10&q=1st&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(users.getById(1)));

    fetchMock
      .get(client.resolve('/1/users?page=1&per_page=10&q=1st&sort='), listResponse)
      .get(client.resolve('/1/users/1'), singleResponse)
      .get(client.resolve('/1/users/me'), singleResponse);
  },
  getById: id => users.list.find(v => v.id === id),
  list: [{
    href: '/1/users/1',
    id: 1,
    preferences: {
      track: {
        homepage: '/trk',
      },
    },
  }, ],
};

export const vehicles = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(vehicles.list), {
        headers: {
          Link: '</1/SYNC/vehicles?page=1&per_page=10&q=12&sort=>; rel="next", </1/SYNC/vehicles?page=1&per_page=10&q=12&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(vehicles.getById(1)));

    fetchMock
      .get(client.resolve('/1/SYNC/vehicles?page=1&per_page=10&q=12&sort='), listResponse)
      .get(client.resolve('/1/SYNC/vehicles/1'), singleResponse);
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
        href: '/1/SYNC/vehicles/1'
      },
      driver: {
        href: '/1/SYNC/drivers/1'
      },
      pattern: {
        href: '/1/SYNC/patterns/1'
      },
      run: {
        href: '/1/SYNC/runs/1'
      },
      trip: {
        href: '/1/SYNC/trips/1'
      },
      start: '2017-01-01T00:00:00.000-07:00',
      sign_in_type: 'Dispatch',
      on_break: false,
    },
  }, ],
};

const realTimeUri = 'ws://localhost:8083/1/realtime';
export const realTime = {
  uri: realTimeUri,
  options: {
    realTimeUri
  },
  authenticatedClient: {
    authenticated: Promise.resolve(),
  },

  /**
   * Returns a websocket server to which you can attach events.
   * It provides a number of convenience methods for testing:
   * - It will already have a handler to respond to authentication messages with success.
   * - It has an added onTrackMessage property, which allows you to define a handler for
   *   a specific Track message type.
   * - It has a verifySubscription property, which can be used to monitor incoming messages, verify
   *   a request for a subscription has been made, and automatically close the server connection and
   *   (if passed in) an associated RealTimeClient.
   * @returns {Server} a server object, with added convenience properties.
   */
  getServer: () => {
    const server = new Server(realTimeUri);
    /**
     * A convenience method -- will deserialize JSON received by the web socket and check the 'type'
     * property.  If it matches what you passed in, it will execute `handler` with the deserialized
     * event data.
     * @param {String} messageType String to verify against the 'type' property of the received data
     * @param {function} handler The handler function to execute if 'type' matches.
     * @returns {Promise} A promise that is resolved with the received message when handler fires.
     */
    server.onTrackMessage = (messageType, handler) => {
      if (typeof handler !== 'function') return;
      server.on('message', (data) => {
        const message = JSON.parse(data);
        if (message.type === messageType) {
          handler(message);
        }
      });
    };

    /**
     * Monitors incoming messages for a subscription request to the specified entity.
     * When one is found, it strips the request of its [type, customer, entity, request_id]
     * properties to leave only the filters.  Returns a promise that resolves with all of the
     * filters.
     * @param {String} entityName The name of the entity for which to check for subscriptions
     * @param {Object} options An options object.
     * @param {boolean} [options.closeConnection] Whether to immediately close the server and a
     * passed-in RealTimeClient after receiving the subscription request.
     * @param {RealTimeClient} [options.realTimeClient] The real time client to close if closing the
     * connection.
     * @returns {Promise} A promise that resolves with all filters passed in for the request
     * function.
     */
    server.verifySubscription = (entityName, options = {}) => {
      let resolver;
      const promise = new Promise((resolve) => {
        resolver = resolve;
      });
      server.onTrackMessage(messages.SUBSCRIPTION_START.REQUEST, (data) => {
        if (data.entity === entityName) {
          // eslint-disable-next-line no-unused-vars
          const {
            type,
            customer,
            entity,
            request_id,
            ...rest
          } = data;

          if (options.closeConnection) {
            // it's important to close the realtime client before the server,
            // otherwise the client will attempt to reconnect.
            server.closeConnection(options.realTimeClient);
          }
          resolver(rest);
        }
      });
      return promise;
    };

    server.closeConnection = (realTimeClient) => {
      if (realTimeClient && typeof realTimeClient.closeConnection === 'function') {
        realTimeClient.closeConnection();
      }
      server.close();
    };

    // automatically accept any authentication request our test server receives.
    server.onTrackMessage(messages.AUTHENTICATION.REQUEST, () => {
      const response = JSON.stringify({
        type: messages.AUTHENTICATION.SUCCESS,
      });
      server.emit('message', response);

      let subscriptionIdCounter = 0;
      server.onTrackMessage(messages.SUBSCRIPTION_START.REQUEST, (request) => {
        subscriptionIdCounter += 1;
        const subscriptionId = subscriptionIdCounter;

        server.emit('message', JSON.stringify({
          type: messages.SUBSCRIPTION_START.SUCCESS,
          request_id: request.request_id,
          subscription_id: subscriptionId,
        }));

        let data;
        switch (request.entity) {
          case 'VEHICLES':
            data = vehicles.list.map((vehicle) => {
              const {
                // eslint-disable-next-line no-unused-vars
                assignment: ignored,
                ...rest
              } = vehicle;
              return rest;
            });
            break;
          case 'ASSIGNMENTS':
            data = vehicles.list.map(v => v.assignment);
            break;
          case 'STOPTIMES':
            console.warn('Need to define mocks for STOPTIMES');
            data = [];
            break;
          default:
            throw new Error(`Don't know what to emit for ${request.entity}`);
        }

        server.emit('message', JSON.stringify({
          type: messages.ENTITY.UPDATE,
          subscription_id: subscriptionId,
          data,
        }));
      });

      server.onTrackMessage(messages.SUBSCRIPTION_END.REQUEST, (request) => {
        server.emit('message', JSON.stringify({
          type: messages.SUBSCRIPTION_END.SUCCESS,
          request_id: request.request_id,
          subscription_id: request.subscription_id,
        }));
      });
    });
    return server;
  },
};
