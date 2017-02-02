import Resource from './Resource';
import Vehicle from './Vehicle';

class Assignment extends Resource {
  constructor(client, ...rest) {
    super(client);
    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href');
    const references = {
      vehicle: newProperties.vehicle && new Vehicle(this.client, newProperties.vehicle),
    };

    Object.assign(this, newProperties, {
      hydrated,
      ...references,
    });
  }
}

export default Assignment;
