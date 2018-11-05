import Resource from './Resource';
import Route from './Route';
import Stop from './Stop';
import Tag from './Tag';

/**
 * Sign message resource
 */
class SignMessage extends Resource {
  /**
   * Creates a new sign message
   *
   * Will populate itself with the values given to it after the client parameter
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, ...rest) {
    super(client);
    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href');
    const references = {
      routes: newProperties.routes && newProperties.routes.map(x => new Route(this.client, x)),
      stops: newProperties.stops && newProperties.stops.map(x => new Stop(this.client, x)),
      tags: newProperties.tags && newProperties.tags.map(x => new Tag(this.client, x)),
    };

    Object.assign(this, newProperties, {
      hydrated,
      ...references,
    });
  }
}

export default SignMessage;
