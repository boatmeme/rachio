const DataStore = require('./DataStore');

class RachioDataStore extends DataStore {
  constructor(baseUrl, accessToken) {
    super(baseUrl, {
      Authorization: `Bearer ${accessToken}`,
    });
    this.accessToken = accessToken;
  }
}

module.exports = RachioDataStore;
