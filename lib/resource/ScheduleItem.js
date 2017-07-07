const Resource = require('./Resource');

class ScheduleItem extends Resource {
  constructor(dataStore, data) {
    super('device/{deviceId}/scheduleitem', dataStore, data);
  }
}

module.exports = ScheduleItem;
