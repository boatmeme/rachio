const Resource = require('./Resource');

class CurrentSchedule extends Resource {
  constructor(dataStore, data) {
    super('device/{deviceId}/current_schedule', dataStore, data);
  }
}

module.exports = CurrentSchedule;
