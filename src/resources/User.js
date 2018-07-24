import Resource from './Resource';

/**
 * User resource
 */
class User extends Resource {
  /**
   * Creates a new user
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial user data to a new instance</caption>
   * const client = new Client();
   * const partialUserData = {
   *   href: '/1/users/1',
   *   id: 1,
   * };
   * const user = new User(client, partialUserData);
   *
   * user.hydrated == true;
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, ...rest) {
    super(client);

    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href');

    Object.assign(this, newProperties, {
      hydrated,
    });
  }

  /**
   * Makes a href for a given ID
   * @param {Number} id User ID
   * @returns {string} URI to instance of user
   */
  static makeHref(id) {
    return {
      href: `/1/users/${id}`,
    };
  }

  /**
   * Fetches the data for this user via the client
   * @returns {Promise} If successful, a hydrated instance of this user
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(user => new User(this.client, this, user));
  }

    /**
   * Updates data for a user via the client
   * @returns {Promise} if successful returns instance of this user
   */
  update() {
    // eslint-disable-next-line no-unused-vars
    const { client, hydrated, href, ...body } = this;
    return this.client.put(href, { body })
      .then(() => new User(this.client, { ...this }));
  }

}

export default User;
