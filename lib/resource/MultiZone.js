const Resource = require('./Resource');

class MultiZone extends Resource {
  constructor(dataStore) {
    super('', dataStore, {});
    this._zones = [];
  }

  get() {
    return Promise.reject(`GET Not Implemented for ${this.class}`);
  }

  add({ id }, duration = 60) {
    this._zones = [...this._zones, { id, duration }];
    return this;
  }

  start() {
    return this._dataStore.put('zone/start_multiple', { zones: this._zones });
  }
}

module.exports = MultiZone;
