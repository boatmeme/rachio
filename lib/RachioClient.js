const { mapValues, orderBy } = require('./utils');

const RachioDataStore = require('./datastore/RachioDataStore');
const {
  Person,
  Device,
  Event,
  Zone,
  MultiZone,
  CurrentConditions,
  CurrentSchedule,
  ScheduleItem,
  ScheduleRule,
  FlexScheduleRule,
  Forecast,
} = require('./resource');

const defaults = {
  version: 1,
  units: 'US',
};

const exposedResources = {
  Device,
  Person,
  Zone,
  Event,
  Forecast,
  CurrentConditions,
  ScheduleItem,
  ScheduleRule,
  FlexScheduleRule,
  CurrentSchedule,
};

class RachioClient {
  constructor(accessToken, opts = {}) {
    this.accessToken = accessToken;
    this.opts = Object.assign({}, defaults, opts);
    this.uri = `https://api.rach.io/${this.opts.version}/public`;
    this._dataStore = new RachioDataStore(this.uri, this.accessToken);
    Object.assign(this, mapValues(exposedResources, Service => new Service(this._dataStore)));
  }

  getPersonInfo() {
    return this.Person.getCurrentlyLoggedIn();
  }
  getPerson(id) {
    return this.Person.get({ id });
  }

  getDevice(id) {
    return this.Device.get({ id });
  }

  getDeviceCurrentSchedule(deviceId) {
    return this.CurrentSchedule.get({ deviceId });
  }

  getDeviceEvents(deviceId, startTime, endTime, filters) {
    return this.Event.get({ deviceId }, startTime, endTime, filters);
  }

  getDeviceCurrentConditions(deviceId, units = this.opts.units) {
    return this.CurrentConditions.get({ deviceId }, { units });
  }

  getDeviceForecast(deviceId, startTime, endTime, units = this.opts.units) {
    return this.Forecast.get({ deviceId }, startTime, endTime, units);
  }

  getDeviceForecastToday(deviceId, units = this.opts.units) {
    return this.Forecast.getToday({ deviceId }, units);
  }

  getDeviceForecastTomorrow(deviceId, units = this.opts.units) {
    return this.Forecast.getTomorrow({ deviceId }, units);
  }

  getDevices() {
    return this.getPersonInfo()
      .then(({ devices }) => devices);
  }

  getZonesByDevice(deviceId) {
    return this.getDevice(deviceId)
      .then(({ zones }) => zones)
      .then(zones => orderBy(zones, 'zoneNumber'));
  }

  getZone(zoneId) {
    return this.Zone.get({ id: zoneId });
  }

  multiZone() {
    return new MultiZone(this._dataStore);
  }

  getScheduleRule(id) {
    return this.ScheduleRule.get({ id });
  }

  getFlexScheduleRule(id) {
    return this.FlexScheduleRule.get({ id });
  }
}

module.exports = RachioClient;
