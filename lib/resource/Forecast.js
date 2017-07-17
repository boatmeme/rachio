const Resource = require('./Resource');
const { AddTime, EndOfDay, StartOfDay, FilterPropertyBetween } = require('../utils');

class Forecast extends Resource {
  constructor(dataStore, data) {
    super('device/{deviceId}/forecast', dataStore, data, { forecast: Forecast });
  }

  get(urlObj, startTime, endTime = startTime, units = 'US') {
    return super.get(urlObj, { units })
      .then(({ forecast }) => forecast)
      .then(FilterPropertyBetween('localizedTimeStamp', !startTime ? startTime : StartOfDay(startTime), !endTime ? endTime : EndOfDay(endTime)));
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
