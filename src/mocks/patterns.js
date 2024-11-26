// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import Client from '../Client';

const patterns = {
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
    const createDetourPatternResponse = () => new Response(Client.toBlob({
      "href": "/1/{customerCode}/patterns/1"}));
    
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
        .get(client.resolve('/1/SYNC/patterns?page=1&per_page=10&enabled_for_operations=true&as_of=2018-03-05T00%3A00%3A00.000Z&sort='), listResponse)
        .get(client.resolve('/1/SYNC/patterns?page=1&per_page=10&expand=stops&sort='), listResponseWithStops)
        .get(client.resolve('/1/SYNC/patterns?page=1&per_page=10&expand=stops&enabled_for_operations=true&as_of=2018-03-05T00%3A00%3A00.000Z&sort='), listResponseWithStops)
        .get(client.resolve('/1/SYNC/patterns/1'), singleResponse)
        .get(client.resolve('/1/SYNC/patterns/1?expand=stops'), singleResponse)
        .get(client.resolve('/1/SYNC/patterns/1?expand=route'), singleResponse)
        .get(client.resolve('/1/SYNC/patterns/1?expand=stops,route'), singleResponse)
        .post(client.resolve('/1/SYNC/patterns/detour'), createDetourPatternResponse);
  },
  getById: id => patterns.list
    .map(p => ({ ...p,
      stops: patterns.patternStopReferences,
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
  }],
  patternStopReferences: [
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
  patternStops: [
    {
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

export default patterns;
