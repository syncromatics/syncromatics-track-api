import Resource from './Resource';
import VehiclesContext from './VehiclesContext';
import Vehicle from './Vehicle';

class Customer extends Resource {
  constructor(client, customerCode) {
    super(client);

    this.code = customerCode;
  }

  vehicles() {
    return this.resource(VehiclesContext, this.code);
  }

  vehicle(id) {
    return this.resource(Vehicle, Vehicle.makeHref(this.code, id));
  }
}

export default Customer;
