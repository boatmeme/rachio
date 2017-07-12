const Resource = require('./Resource');
const RefreshableResourceMixin = require('./RefreshableResourceMixin');

class CurrentConditions extends Resource {
  constructor(dataStore, data) {
    super('device/{deviceId}/forecast', dataStore, data, { current: CurrentConditions });
  }

  get(urlObj, units = 'US') {
    return super.get(urlObj, { units })
      .then(({ current }) => current);
  }
}

module.exports = RefreshableResourceMixin(CurrentConditions);
