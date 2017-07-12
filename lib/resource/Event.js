const Resource = require('./Resource');
const moment = require('moment');
const { Filter } = require('../utils');

class Event extends Resource {
  constructor(dataStore, data) {
    super('device/{deviceId}/event', dataStore, data);
  }

  get(urlObj, startTime = moment().subtract(28, 'days').valueOf(), endTime = Date.now(), filters = {}) {
    return super.get(urlObj, { startTime, endTime })
      .then(Filter(filters));
  }
}

module.exports = Event;
