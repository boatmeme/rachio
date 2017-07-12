const Resource = require('./Resource');
const RefreshableResourceMixin = require('./RefreshableResourceMixin');

class CurrentSchedule extends Resource {
  constructor(dataStore, data) {
    super('device/{deviceId}/current_schedule', dataStore, data);
  }
}

module.exports = RefreshableResourceMixin(CurrentSchedule);
