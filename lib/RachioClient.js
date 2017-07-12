const _ = require('lodash');

const RachioDataStore = require('./datastore/RachioDataStore');
const Device = require('./resource/Device');
const Person = require('./resource/Person');
const Event = require('./resource/Event');
const Zone = require('./resource/Zone');
const MultiZone = require('./resource/MultiZone');
const CurrentConditions = require('./resource/CurrentConditions');
const CurrentSchedule = require('./resource/CurrentSchedule');
const ScheduleItem = require('./resource/ScheduleItem');
const ScheduleRule = require('./resource/ScheduleRule');
const FlexScheduleRule = require('./resource/FlexScheduleRule');
const Forecast = require('./resource/Forecast');

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
    Object.assign(this, _.mapValues(exposedResources, Service => new Service(this._dataStore)));
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
      .then(({ zones }) => zones);
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
/*
  getWebhookTypes() {
    return this._api.get({ endpoint: '/notification/webhook_event_type' });
  }

  getWebhooksByDevice(deviceId) {
    return this._api.get({ endpoint: `/notification/${deviceId}/webhook` });
  }

  getWebhook(webhookId) {
    return this._api.get({ endpoint: `/notification/webhook/${webhookId}` });
  }
  */
}

module.exports = RachioClient;
