const Resource = require('./Resource');
const { Filter } = require('../utils');

class Event extends Resource {
  constructor(dataStore, data) {
    super('device/{deviceId}/event', dataStore, data);
  }

  get(urlObj, startTime, endTime, filters = {}) {
    return super.get(urlObj, { startTime, endTime })
      .then(Filter(filters));
  }
}

module.exports = Event;
