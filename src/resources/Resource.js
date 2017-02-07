/**
 * Base "Resource" context type for all other resources
 */
class Resource {
  /**
   * Creates a new resource
   * @param {Client} client Instance of pre-configured client
   */
  constructor(client) {
    if (!client) {
      throw new Error('Argument "client" is not specified');
    }

    /**
     * Instance of pre-configured client
     * @instance
     */
    this.client = client;

    /**
     * Determines whether the resource has been hydrated with data from a call through the client
     * @instance
     */
    this.hydrated = false;
  }

  /**
   * Convenience method for getting an instance of another Resource
   * @param {Object} Type Type of resource to create
   * @param {Array} rest Arguments to pass into constructor of Type
   * @returns {Object} Instance of Type constructed with the given arguments
   */
  resource(Type, ...rest) {
    return new Type(this.client, ...rest);
  }
}

export default Resource;
