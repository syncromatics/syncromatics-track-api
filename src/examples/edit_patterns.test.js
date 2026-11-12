import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import Track from '../index';
import { EditorErrorResponse, ErrorResponse, ForbiddenResponse, NotFoundResponse } from '../responses';
import { charlie } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When using the Sync route editor v2 endpoints', () => {
  const api = new Track({ autoRenew: false });
  const saved = { pattern_id: 123, parent_id: 42 };
  const editorUrl = api.client.resolve('/2/SYNC/patterns/editor/123');
  const createUrl = api.client.resolve('/2/SYNC/patterns');
  const updateUrl = api.client.resolve('/2/SYNC/patterns/123');
  const payload = {
    name: 'Downtown outbound',
    parent_id: 42,
    direction: 2,
    vertices: [
      { latitude: 34.0522, longitude: -118.2437, is_control_point: true, stop_id: 101 },
      { latitude: 34.0525, longitude: -118.2438 }, // Shape-only point.
      { latitude: 34.053, longitude: -118.244, is_control_point: true, new_stop_name: 'Library' },
    ],
  };
  const editorData = {
    ...saved,
    name: payload.name,
    direction: payload.direction,
    pattern_type: 1,
    is_deleted: false,
    created_adhoc: false,
    has_current_or_future_schedule: false,
    vertices: [
      { ...payload.vertices[0], association_id: 501 },
      payload.vertices[1],
      { latitude: 34.053, longitude: -118.244, is_control_point: true,
        stop_id: 102, association_id: 502 },
    ],
    // Stored stop coordinates can differ from geometry; waypoint_order indexes vertices.
    stops: [
      { stop_id: 101, association_id: 501, latitude: 34.0521, longitude: -118.2436,
        waypoint_order: 0 },
      { stop_id: 102, association_id: 502, latitude: 34.053, longitude: -118.244,
        waypoint_order: 2 },
    ],
  };

  beforeEach(() => {
    charlie.setUpSuccessfulMock(api.client);
    fetchMock.catch(503);
    return api.logIn({ username: 'charlie@example.com', password: 'securepassword' });
  });
  afterEach(fetchMock.restore);

  it('selects base routes with filters preserved across pagination', () => {
    const params = {
      page: 1, per_page: 20, pattern_types: '1,4', include_empty: true,
      q: 'Downtown', sort: 'name asc',
    };
    const nextUrl = api.client.resolve('/1/SYNC/routes', { ...params, page: 2 });
    fetchMock.get(api.client.resolve('/1/SYNC/routes', params), {
      body: [{ id: 42, name: 'Downtown' }],
      headers: { Link: `<${nextUrl}>; rel="next"` },
    });
    fetchMock.get(nextUrl, [{ id: 43, name: 'Downtown Express' }]);

    return api
      .customer('SYNC')
      .routes()
      .withPatternTypes([1, 4])
      .withEmptyRoutes()
      .withQuery('Downtown')
      .withPerPage(20)
      .sortedBy('name')
      .getPage()
      .then((page) => {
        page.list[0].id.should.equal(42);
        page.hasNext().should.equal(true);
        return page.next();
      })
      .then(page => page.list[0].id.should.equal(43));
  });

  it('creates, reloads and edits a pattern while retaining stop association IDs', () => {
    let currentEditorData = editorData;
    fetchMock.post(createUrl, {
      status: 201, body: saved, headers: { Location: '/2/SYNC/patterns/editor/123' },
    });
    fetchMock.put(updateUrl, saved);
    fetchMock.get(editorUrl, () => currentEditorData);
    const patterns = api
      .customer('SYNC')
      .patterns();
    let editedPayload;

    return patterns
      .createPattern(payload)
      .then((result) => {
        result.should.deep.equal(saved);
        return new Response(fetchMock.lastOptions().body).json();
      })
      .then((sent) => {
        sent.should.deep.equal(payload);
        // Explicitly reload after saving to obtain new stop and association IDs.
        return patterns.getPatternForSyncRouteEditorV2(saved.pattern_id);
      })
      .then((pattern) => {
        pattern.vertices.should.deep.equal(editorData.vertices);
        pattern.stops.should.deep.equal(editorData.stops);
        const canEdit = pattern.pattern_type === 1 &&
          pattern.is_deleted === false &&
          pattern.created_adhoc === false &&
          pattern.has_current_or_future_schedule === false;
        canEdit.should.equal(true);

        editedPayload = {
          name: 'Downtown outbound revised',
          parent_id: pattern.parent_id,
          direction: pattern.direction,
          // Send complete geometry, retaining is_control_point, stop_id and association_id.
          vertices: pattern.vertices,
        };
        return patterns.updatePattern(pattern.pattern_id, editedPayload);
      })
      .then((result) => {
        result.should.deep.equal(saved);
        return new Response(fetchMock.lastOptions().body).json();
      })
      .then((sent) => {
        sent.should.deep.equal(editedPayload);
        currentEditorData = { ...editorData, ...editedPayload };
        return patterns.getPatternForSyncRouteEditorV2(saved.pattern_id);
      })
      .then((pattern) => {
        pattern.name.should.equal(editedPayload.name);
        pattern.vertices[2].stop_id.should.equal(102);
        pattern.vertices[2].association_id.should.equal(502);
      });
  });

  it('creates a base route using the pattern name', () => {
    fetchMock.post(createUrl, { status: 201, body: saved });
    const newRoute = {
      name: 'New route',
      create_route: true, // Omit parent_id when creating a base route.
      direction: 2,
      vertices: payload.vertices,
    };

    return api
      .customer('SYNC')
      .patterns()
      .createPattern(newRoute)
      .then((result) => {
        result.should.deep.equal(saved);
        return new Response(fetchMock.lastOptions().body).json();
      })
      .then(sent => sent.should.deep.equal(newRoute));
  });

  it('exposes validation messages and field details when creating a pattern', () => {
    const body = { error_message: 'Invalid route editor request', details: { name: ['Required'] } };
    fetchMock.post(createUrl, { status: 400, body });

    return api
      .customer('SYNC')
      .patterns()
      .createPattern({ ...payload, name: '' })
      .should.be.rejected
      .then((error) => {
        error.should.be.instanceof(EditorErrorResponse);
        error.status.should.equal(400);
        error.message.should.equal(body.error_message);
        error.error_message.should.equal(body.error_message);
        error.details.should.deep.equal(body.details);
      });
  });

  it('exposes save conflicts when a pattern becomes ineligible', () => {
    fetchMock.put(updateUrl, {
      status: 409, body: { error_message: 'Pattern now has a schedule', details: ['Cannot edit'] },
    });

    return api
      .customer('SYNC')
      .patterns()
      .updatePattern(123, payload)
      .should.be.rejected
      .then((error) => {
        error.should.be.instanceof(EditorErrorResponse);
        error.status.should.equal(409);
        error.message.should.equal('Pattern now has a schedule');
        error.details.should.deep.equal(['Cannot edit']);
      });
  });

  it('retains the HTTP error when a save response is not JSON', () => {
    fetchMock.put(updateUrl, { status: 409, body: 'Conflict' });

    return api
      .customer('SYNC')
      .patterns()
      .updatePattern(123, payload)
      .should.be.rejected
      .then((error) => {
        error.should.be.instanceof(ErrorResponse);
        error.status.should.equal(409);
      });
  });

  it('preserves access-denied errors when saving without routes privilege', () => {
    fetchMock.put(updateUrl, { status: 403, body: '' });

    return api
      .customer('SYNC')
      .patterns()
      .updatePattern(123, payload)
      .should.be.rejected
      .then((error) => {
        error.should.be.instanceof(ForbiddenResponse);
        error.status.should.equal(403);
      });
  });

  it('preserves missing-pattern errors when loading editor data', () => {
    fetchMock.get(editorUrl, { status: 404, body: '' });

    return api
      .customer('SYNC')
      .patterns()
      .getPatternForSyncRouteEditorV2(123)
      .should.be.rejected
      .then((error) => {
        error.should.be.instanceof(NotFoundResponse);
        error.status.should.equal(404);
      });
  });
});
