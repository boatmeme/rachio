const Resource = require('./Resource');
const RefreshableResourceMixin = require('./RefreshableResourceMixin');

class FlexScheduleRule extends Resource {
  constructor(dataStore, data) {
    super('flexschedulerule/{id}', dataStore, data);
    this._refreshArgs = [{ id: this.id }];
  }
}

module.exports = RefreshableResourceMixin(FlexScheduleRule);
