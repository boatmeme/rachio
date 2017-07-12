const Resource = require('./Resource');
const moment = require('moment');
const { Filter } = require('../utils');

class Event extends Resource {
  constructor(dataStore, data) {
    super('device/{deviceId}/event', dataStore, data);
  }

  get(urlObj, startTime = moment().subtract(28, 'days').valueOf(), endTime = Date.now(), filters = {}) {
    if (startTime < moment().subtract(28, 'days').valueOf()) return Promise.reject(new Error('Events API cannot return Events older than 28 days'));
    return super.get(urlObj, { startTime, endTime })
      .then(Filter(filters));
  }
}

module.exports = Event;
