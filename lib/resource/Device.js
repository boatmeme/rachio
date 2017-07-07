const _ = require('lodash');
const { OneDaySeconds, OneWeekSeconds } = require('../utils');
const Resource = require('./Resource');
const Zone = require('./Zone');
const Forecast = require('./Forecast');
const CurrentSchedule = require('./CurrentSchedule');

class Device extends Resource {
  constructor(dataStore, data) {
    super('device/{id}', dataStore, data, { zones: Zone });
    this._Forecast = new Forecast(dataStore);
    this._CurrentSchedule = new CurrentSchedule(dataStore);
  }

  getZones() {
    return this.get({ id: this.id })
      .then(({ zones }) => zones)
      .then(zones => _.orderBy(zones, 'zoneNumber'));
  }

  getForecast(startTime, endTime, units) {
    return this._Forecast.get({ deviceId: this.id }, startTime, endTime, units);
  }

  getForecastToday(units) {
    return this._Forecast.getToday({ deviceId: this.id }, units);
  }

  getForecastTomorrow(units) {
    return this._Forecast.getTomorrow({ deviceId: this.id }, units);
  }

  getCurrentSchedule() {
    return this._CurrentSchedule.get({ deviceId: this.id });
  }

  stop() {
    return this._dataStore.put('device/stop_water', { id: this.id });
  }

  standbyOff() {
    return this._dataStore.put('device/on', { id: this.id });
  }

  standbyOn() {
    return this._dataStore.put('device/off', { id: this.id });
  }

  rainDelay(duration = OneDaySeconds) {
    if (duration > OneWeekSeconds) return Promise.reject('Maximum rain delay of One Week');
    if (duration < 0) return Promise.reject('Minimum rain delay of 0 seconds');
    return this._dataStore.put('device/rain_delay', { id: this.id, duration });
  }
}

module.exports = Device;
