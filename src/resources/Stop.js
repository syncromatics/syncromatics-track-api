import Resource from './Resource';

/**
 * Stop resource
 */
class Stop extends Resource {
  /**
   * Creates a new stop
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial stop data to a new instance</caption>
   * const client = new Client();
   * const partialStopData = {
   *   href: '/1/SYNC/stops/2',
   *   name: '9876',
   * };
   * const stop = new Stop(client, partialStopData);
   *
   * stop.hydrated == true;
   * @param {Client} client Instance of pre-configured client
   * @param {Array} rest Remaining arguments to use in assigning values to this instance
   */
  constructor(client, ...rest) {
    super(client);

    const newProperties = Object.assign({}, ...rest);
    const hydrated = !Object.keys(newProperties).every(k => k === 'href' || k === 'code');

    Object.assign(this, newProperties, {
      hydrated,
    });
  }

  /**
   * Makes a href for a given customer code and ID
   * @param {string} customerCode Customer code
   * @param {Number} id Stop ID
   * @returns {string} URI to instance of stop
   */
  static makeHref(customerCode, id) {
    return {
      href: `/1/${customerCode}/stops/${id}`,
      code: customerCode,
    };
  }

  /**
   * Fetches the data for this stop via the client
   * @returns {Promise} If successful, a hydrated instance of this stop
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(stop => new Stop(this.client, this, stop));
  }

  /**
   * Saves data for a stop via the client
   * @returns {Promise} If successful, returns a stop with the id included
   */
  create() {
    // eslint-disable-next-line no-unused-vars
    const { client, hydrated, code, ...body } = this;
    return this.client.post(`/1/${code}/stops`, { body })
      .then(response => response.headers.get('location'))
      .then((href) => {
        const match = /\/\d+\/\S+\/stops\/(\d+)/.exec(href);
        return new Stop(this.client, { ...this, href, id: parseFloat(match[1]) });
      });
  }

  /**
   * Updates data for a stop via the client
   * @returns {Promise} If successful, returns instance of this stop
   */
  update() {
    // eslint-disable-next-line no-unused-vars
    const { client, hydrated, code, ...body } = this;
    const { href } = Stop.makeHref(code, this.id);
    return this.client.put(href, { body })
      .then(() => new Stop(this.client, { ...this }));
  }

}

export default Stop;
