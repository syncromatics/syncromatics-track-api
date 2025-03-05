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
   * Fetches historical detours for a given customer.
   * @param {Date} [withStartFrom] - Optional start date to filter detours from (the date any applicable detours started)
   * @param {Date} [withStartUntil] - Optional end date to filter detours to (the date any applicable detours started)
   * @param {boolean} [includeDeactivated=false] - Optional flag to include deactivated detours in the response
   * @param {boolean} [expandDetails=false] - Optional flag to include expanded details in the response
   * @param {number} [count] - Optional number of detours to return. Null or zero will return all applicable detours
   * @returns {Promise<Array<Detour>>} A promise that resolves to an array of historical detours.
   */
  async getHistoricalDetours(withStartFrom, withStartUntil, includeDeactivated, expandDetails,count) {
    const customerCode = this.href.split('/')[2]; // Extract customer code from href
    let endpoint = `/2/${customerCode}/serviceadjustments/detours/historical`;
    
    const params = [];
    if (withStartFrom instanceof Date) {
      params.push(`startDate=${encodeURIComponent(withStartFrom.toISOString())}`);
    }
    if (withStartUntil instanceof Date) {
      params.push(`endDate=${encodeURIComponent(withStartUntil.toISOString())}`);
    }
    if (includeDeactivated) {
      params.push('includeDeactivated=true');
    }
    if (expandDetails) {
      params.push('expandDetails=true');
    }
    if(count && count > 0){
      params.push(`count=${count}`);
    }
    if (params.length > 0) {
      endpoint += `?${params.join('&')}`;
    }

    const { client } = this;
    return client.get(endpoint)
      .then(response => response.json())
      .then(detours => detours.map(detour => new Detour(client, detour)));
  }

  /**
   * Makes a href for a given customer code and detour id
   * @param {string} customerCode Customer code
   * @param {number} id Detour ID
   * @returns {{href: string}} URI to instance of detour
   */
  static makeHref(customerCode) {
    return {
      href: `/2/${customerCode}/serviceadjustments/detours`,
    };
  }

  /**
   * Fetches the data for this detour via the client
   * @returns {Promise} If successful, a hydrated instance of detours
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
   * @returns {Promise<Detour>} A promise that resolves to a hydrated instance of the Detour class, representing all active detours including the newly created detour.
   */
  async create(data) {
    const body = data;

    const { client } = this;
    return this.client.post(this.href, { body })
      .then(response => response.json())
      .then(detours => new Detour(client, detours));
  }

  /**
   * Update an existing detour for a customer via the client.
   *  
   * @param {number} detourId - The ID of the detour to update.
   * @returns {Promise<Detour>} A promise that resolves to a hydrated instance of the Detour class, representing active detours.
   */
  async deactivate(detourId) {
    const { client } = this;
    return this.client.delete(`${this.href}/${detourId}`)
      .then(response => response.json())
      .then(detours => new Detour(client, detours));
  }
}

export default Detour;