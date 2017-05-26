// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from './Client';

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

export const messageTemplates = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(messageTemplates.list),
      {
        headers: {
          Link: '</1/SYNC/message_templates?page=1&perPage=10&q=5k&sort=>; rel="next", </1/SYNC/message_templates?page=1&perPage=10&q=5k&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(messageTemplates.getById(1)));
    const createResponse = () => new Response(undefined, {
      headers: {
        Location: '/1/SYNC/message_templates/1',
      },
    });

    fetchMock
      .get(client.resolve('/1/SYNC/message_templates?page=1&perPage=10&q=5k&sort='), listResponse)
      .get(client.resolve('/1/SYNC/message_templates/1'), singleResponse)
      .post(client.resolve('/1/SYNC/message_templates'), createResponse)
      .put(client.resolve('/1/SYNC/message_templates/1'), createResponse);
  },
  getById: id => messageTemplates.list.find(v => v.id === id),
  list: [
    {
      href: '/1/SYNC/message_templates/1',
      id: 1,
      name: '5k Detour',
      text: 'Due to the 5k Race, buses will detour off Figueroa from 6pm to 11am on 2/15/17. Find northbound buses on Hope, southbound buses on Flower.',
      start: '2017-02-12T08:00:00-08:00',
      end: '2017-02-15T11:00:00-08:00',
      sign_messages: [
        {
          id: 1,
          override_text: 'Due to the 5k, buses will be on detour.',
          schedules: [
            {
              day_of_week: 1,
              start: '06:00:00',
              end: '18:00:00',
            },
          ],
          tags: [
            {
              href: '/1/SYNC/tags/1',
            },
          ],
          routes: [
            {
              href: '/1/SYNC/routes/1',
            },
          ],
          stops: [
            {
              href: '/1/SYNC/stops/1',
            },
          ],
          signs: [
            {
              href: '/1/SYNC/signs/1',
            },
          ],
        },
      ],
    },
  ],
};

export const routes = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(routes.list),
      {
        headers: {
          Link: '</1/SYNC/routes?page=1&perPage=10&q=blue&sort=>; rel="next", </1/SYNC/routes?page=1&perPage=10&q=blue&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(routes.getById(1)));

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

export const patterns = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
    Client.toBlob(patterns.list),
      {
        headers: {
          Link: '</1/SYNC/patterns?page=1&perPage=10&q=blue&sort=>; rel="next", </1/SYNC/patterns?page=1&perPage=10&q=blue&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(patterns.getById(1)));

    fetchMock
      .get(client.resolve('/1/SYNC/patterns?[age=1&perPage=10&q=blue&sort='), listResponse)
      .get(client.resolve('/1/SYNC/patterns/1'), singleResponse);
  },
  getById: id => patterns.list.find(p => p.id === id),
  list: [
    {
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
      stops: [
        {
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
      href: '/1/SYNC/patterns/1',
    },
  ],
};

export const signs = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(signs.list),
      {
        headers: {
          Link: '</1/SYNC/signs?page=1&perPage=10&q=first&sort=>; rel="next", </1/SYNC/signs?page=1&perPage=10&q=first&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(signs.getById(1)));

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
      Client.toBlob(stops.list),
      {
        headers: {
          Link: '</1/SYNC/stops?page=1&perPage=10&q=1st&sort=>; rel="next", </1/SYNC/stops?page=1&perPage=10&q=1st&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(stops.getById(1)));

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

export const tags = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(tags.list),
      {
        headers: {
          Link: '</1/SYNC/tags?page=1&perPage=10&q=LA&sort=>; rel="next", </1/SYNC/tags?page=1&perPage=10&q=LA&sort=>; rel="last"',
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
      .get(client.resolve('/1/SYNC/tags?page=1&perPage=10&q=LA&sort='), listResponse)
      .get(client.resolve('/1/SYNC/tags/3'), singleResponse)
      .post(client.resolve('/1/SYNC/tags'), postResponse)
      .put(client.resolve('/1/SYNC/tags/3'), putResponse);
  },
  getById: id => tags.list.find(v => v.id === id),
  list: [
    {
      href: '/1/SYNC/tags/3',
      id: 3,
      name: 'DTLA',
      customerId: 1,
    },
  ],
};

export const users = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(users.list),
      {
        headers: {
          Link: '</1/users?page=1&perPage=10&q=1st&sort=>; rel="next", </1/users?page=1&perPage=10&q=1st&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(users.getById(1)));

    fetchMock
      .get(client.resolve('/1/users?page=1&perPage=10&q=1st&sort='), listResponse)
      .get(client.resolve('/1/users/1'), singleResponse)
      .get(client.resolve('/1/users/me'), singleResponse);
  },
  getById: id => users.list.find(v => v.id === id),
  list: [
    {
      href: '/1/users/1',
      id: 1,
      preferences: {
        track: {
          homepage: '/trk',
        },
      },
    },
  ],
};

export const vehicles = {
  setUpSuccessfulMock: (client) => {
    const listResponse = () => new Response(
      Client.toBlob(vehicles.list),
      {
        headers: {
          Link: '</1/SYNC/vehicles?page=1&perPage=10&q=12&sort=>; rel="next", </1/SYNC/vehicles?page=1&perPage=10&q=12&sort=>; rel="last"',
        },
      });
    const singleResponse = () => new Response(Client.toBlob(vehicles.getById(1)));

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
