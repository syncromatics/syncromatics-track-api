import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Client from '../Client';
import Customer from './Customer';
import Vehicle from './Vehicle';
import VehiclesContext from './VehiclesContext';

chai.should();
chai.use(chaiAsPromised);

describe('When getting resources related to a customer', () => {
  const client = new Client();
  const customer = new Customer(client, 'SYNC');

  it('should allow vehicles to be searched', () => customer.vehicles().should.be.instanceof(VehiclesContext));
  it('should allow a vehicle to be retrieved', () => customer.vehicle().should.be.instanceof(Vehicle));
});
