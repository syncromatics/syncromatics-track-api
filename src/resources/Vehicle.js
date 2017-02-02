import Resource from './Resource';
import Assignment from './Assignment';

class Vehicle extends Resource {
  constructor(client, ...rest) {
    super(client);

    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href');
    const references = {
      assignment: newProperties.assignment && new Assignment(this.client, newProperties.assignment),
    };

    Object.assign(this, newProperties, {
      hydrated,
      ...references,
    });
  }

  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/vehicles/${id}`,
    };
  }

  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(vehicle => new Vehicle(this.client, this, vehicle));
  }
}

export default Vehicle;
