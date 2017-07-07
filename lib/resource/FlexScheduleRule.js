const Resource = require('./Resource');

class FlexScheduleRule extends Resource {
  constructor(dataStore, data) {
    super('flexschedulerule/{id}', dataStore, data);
  }
}

module.exports = FlexScheduleRule;
