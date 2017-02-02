import 'isomorphic-fetch';
import PagedContext from './PagedContext';
import Vehicle from './Vehicle';

class VehiclesContext extends PagedContext {
  constructor(client, customerCode, params) {
    super(client, { ...params });
    this.code = customerCode;
  }

  withQuery(term) {
    this.params.q = term;
    return this;
  }

  getPage() {
    return this.page(Vehicle, `/1/${this.code}/vehicles`);
  }
}

export default VehiclesContext;
