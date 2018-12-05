import Resource from './Resource';

/**
 * VehicleMedia resource
 */
class VehicleMedia extends Resource {
  /**
   * Creates a new vehicleMedia
   *
   * Will populate itself with the values given to it after the client parameter
   * @example <caption>Assigning partial vehicle media data to a new instance</caption>
   * const client = new Client();
   * const partialVehicleMediaData = {
   *   href: '/1/SYNC/vehicle/2/media/1',
   *   contentType: 'image/jpeg',
   *   name: '1',
   * };
   * const vehicleMedia = new VehicleMedia(client, partialVehicleMediaData);
   *
   * vehicleMedia.hydrated == true;
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
   * Makes a href for a given customer code and ID
   * @param {string} customerCode Customer code
   * @param {Number} vehicleId Vehicle ID
   * @param {string} mediaId Media ID
   * @returns {string} URI to instance of vehicle media
   */
  static makeHref(customerCode, vehicleId, mediaId) {
    return {
      href: `/1/${customerCode}/vehicles/${vehicleId}/media/${mediaId}`,
    };
  }

  /**
   * Fetches the data for this vehicle media via the client
   * @returns {Promise} If successful, a hydrated instance of this vehicle media
   */
  fetch() {
    return this.client.get(this.href)
      .then(response => new VehicleMedia(this.client, this, {
        name: response.headers.get('Name'),
        contentType: response.headers.get('Content-Type'),
        data: response.blob(),
      }));
  }
}

export default VehicleMedia;
