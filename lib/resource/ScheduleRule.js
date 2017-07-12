const Resource = require('./Resource');

class ScheduleRule extends Resource {
  constructor(dataStore, data) {
    super('schedulerule/{id}', dataStore, data);
  }

  skip() {
    return this._dataStore.put('schedulerule/skip', { id: this.id });
  }

  start() {
    return this._dataStore.put('schedulerule/start', { id: this.id });
  }

  seasonalAdjustment(adjustment = 0) {
    if (adjustment > 1.0 || adjustment < -1.0) return Promise.reject(new Error('Adjustment should be a Float between 1.0 and -1.0'));
    return this._dataStore.put('schedulerule/seasonal_adjustment', { id: this.id, adjustment });
  }
}

module.exports = ScheduleRule;
