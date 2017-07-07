const Resource = require('./Resource');

class CurrentConditions extends Resource {
  constructor(dataStore, data) {
    super('device/{deviceId}/forecast', dataStore, data);
  }

  get(urlObj, qs = {}, header = {}) {
    return super.get(urlObj, qs, header)
      .then(({ current }) => current);
  }
}

module.exports = CurrentConditions;
