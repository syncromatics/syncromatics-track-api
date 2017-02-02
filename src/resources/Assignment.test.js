import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Client from '../Client';
import Vehicle from './Vehicle';
import Assignment from './Assignment';
import { vehicles as mockVehicles } from '../mocks';

chai.should();
chai.use(chaiAsPromised);

describe('When instantiating a assignment based on an object', () => {
  const client = new Client();
  const mockAssignment = mockVehicles.getById(1).assignment;
  const assignment = new Assignment(client, mockAssignment);

  it('should be hydrated', () => assignment.hydrated.should.equal(true));
  it('should have an assignment', () => assignment.vehicle.should.be.an.instanceof(Vehicle));
});
