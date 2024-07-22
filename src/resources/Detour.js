import Resource from './Resource';

/**
 * Detour resource
 */
class Detour extends Resource {
  /**
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
   * Makes a href for a given customer code and detour id
   * @param {string} customerCode Customer code
   * @param {number} id Detour ID
   * @returns {{href: string}} URI to instance of detour
   */
  static makeHref(customerCode) {
    return {
      href: `/1/${customerCode}/serviceadjustments/detours`,
    };
  }

  /**
   * Fetches the data for this detour via the client
   * @returns {Promise} If successful, a hydrated instance of this detour
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => response.json())
      .then(detours => new Detour(this.client, this, detours));
  }

  /**
   * Create a new detour for a customer via the client.
   * 
   * @param {Object} data - The data object for creating a new detour.
   * @param {number} data.patternId - The ID of the pattern associated with this detour.
   * @param {number} data.detourPatternId - The ID of the detour pattern.
   * @param {string} data.title - The title of the detour.
   * @param {boolean} data.shouldMatchScheduledStops - Indicates whether the detour should match scheduled stops.
   * @param {Date} data.startDateTime - The start date and time of the detour.
   * @param {Date} data.endDateTime - The end date and time of the detour.
   * 
   * @returns {Promise<Detour>} A promise that resolves to a hydrated instance of the Detour class, representing the newly created detour.
   */
  async create(data) {
    const requestBody = {
      patternId: data.patternId,
      detourPatternId: data.detourPatternId,
      title: data.title,
      shouldMatchScheduledStops: data.shouldMatchScheduledStops,
      startDateTime: data.startDateTime.toISOString(),
      endDateTime: data.endDateTime.toISOString(),
    };

    return this.client.post(this.href, requestBody)
      .then(response => response.json())
      .then(detours => new Detour(this.client, detours));
  }
}

export default Detour;