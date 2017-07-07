const Resource = require('./Resource');
const MultiZone = require('./MultiZone');

class Zone extends Resource {
  constructor(dataStore, data) {
    super('zone/{id}', dataStore, data);
  }

  start(duration = 60) {
    return this._dataStore.put('zone/start', { id: this.id, duration });
  }

  multi(duration = 60) {
    return new MultiZone(this._dataStore).add(this, duration);
  }
}

module.exports = Zone;
