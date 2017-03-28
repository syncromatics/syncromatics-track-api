import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Client from '../Client';
import Customer from './Customer';
import Route from './Route';
import RoutesContext from './RoutesContext';
import Sign from './Sign';
import SignsContext from './SignsContext';
import Stop from './Stop';
import StopsContext from './StopsContext';
import Vehicle from './Vehicle';
import VehiclesContext from './VehiclesContext';

chai.should();
chai.use(chaiAsPromised);

describe('When getting resources related to a customer', () => {
  const client = new Client();
  const customer = new Customer(client, 'SYNC');

  it('should allow routes to be searched', () => customer.routes().should.be.instanceof(RoutesContext));
  it('should allow a route to be retrieved', () => customer.route().should.be.instanceof(Route));
  it('should allow signs to be searched', () => customer.signs().should.be.instanceof(SignsContext));
  it('should allow a sign to be retrieved', () => customer.sign().should.be.instanceof(Sign));
  it('should allow stops to be searched', () => customer.stops().should.be.instanceof(StopsContext));
  it('should allow a stop to be retrieved', () => customer.stop().should.be.instanceof(Stop));
  it('should allow vehicles to be searched', () => customer.vehicles().should.be.instanceof(VehiclesContext));
  it('should allow a vehicle to be retrieved', () => customer.vehicle().should.be.instanceof(Vehicle));
});
