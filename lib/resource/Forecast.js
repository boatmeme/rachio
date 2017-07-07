const Resource = require('./Resource');
const { AddTime, EndOfDay, StartOfDay, FilterPropertyBetween } = require('../utils');

class Forecast extends Resource {
  constructor(dataStore, data) {
    super('device/{deviceId}/forecast', dataStore, data);
  }

  get(urlObj, startTime, endTime = AddTime(startTime, 1, 'day'), units = 'US') {
    return super.get(urlObj, { units })
      .then(({ forecast }) => forecast)
      .then(FilterPropertyBetween('localizedTimeStamp', startTime, endTime));
  }

  getToday(urlObj, units = 'US') {
    return this.get(urlObj, StartOfDay(), EndOfDay(), units)
      .then(([todayForecast]) => todayForecast);
  }

  getTomorrow(urlObj, units = 'US') {
    const tomorrow = AddTime(Date.now(), 1, 'day');
    return this.get(urlObj, StartOfDay(tomorrow), EndOfDay(tomorrow), units)
      .then(([tomorrowForecast]) => tomorrowForecast);
  }
}

module.exports = Forecast;
