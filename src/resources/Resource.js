class Resource {
  constructor(client) {
    if (!client) {
      throw new Error('Argument "client" is not specified');
    }

    this.client = client;
    this.hydrated = false;
  }

  resource(Type, ...rest) {
    return new Type(this.client, ...rest);
  }
}

export default Resource;
