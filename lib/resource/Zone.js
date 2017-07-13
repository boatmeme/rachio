const _ = require('lodash');
const Resource = require('./Resource');
const MultiZone = require('./MultiZone');
const RefreshableResourceMixin = require('./RefreshableResourceMixin');

const getDeviceForZone = function _getDeviceForZone(id, dataStore) {
  // Instantiated here due to cyclical dependency
  const Person = require('./Person'); // eslint-disable-line
  return new Person(dataStore).getCurrentlyLoggedIn()
    .then(({ devices }) => _.find(devices, ({ zones }) => _.find(zones, { id })));
};

const memoizedDeviceForZone = _.memoize(getDeviceForZone);

class Zone extends Resource {
  constructor(dataStore, data) {
    super('zone/{id}', dataStore, data);
    this._refreshArgs = [{ id: this.id }];
  }

  isWatering() {
    return memoizedDeviceForZone.call(this, this.id, this._dataStore)
      .then(device => device.getActiveZone())
      .then(activeZone => this.id === activeZone.id);
  }

  getDevice() {
    return getDeviceForZone.call(this, this.id, this._dataStore);
  }

  start(duration = 60) {
    return this._dataStore.put('zone/start', { id: this.id, duration });
  }

  stop() {
    return memoizedDeviceForZone.call(this, this.id, this._dataStore)
      .then(device => device.stopWater());
  }

  multi(duration = 60) {
    return new MultiZone(this._dataStore).add(this, duration);
  }
}

module.exports = RefreshableResourceMixin(Zone);
