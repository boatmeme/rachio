const should = require('should');
const Rachio = require('../');
const moment = require('moment');
const {
  setupFixtures,
  teardownFixtures,
  Fixtures,
} = require('./fixtures');
const {
  validateArray,
  validateDevice,
  validateCurrentSchedule,
  validateEvent,
  validateError,
  validateForecast,
  validateCurrentConditions,
  validateZone,
  validateMultiZone,
} = require('./validators');

const apiToken = process.env.RACHIO_API_TOKEN || '8e600a4c-0027-4a9a-9bda-dc8d5c90350d';


describe('Device', () => {
  let client;
  let device;

  before(() => {
    setupFixtures(Fixtures.Generic)();
    client = new Rachio(apiToken);
    return client.getDevices()
      .then(([device1]) => {
        device = device1;
      });
  });
  after(teardownFixtures);

  describe('Zones', () => {
    it('should get the zones for the specified device', () =>
      device.getZones()
        .then(validateArray(validateZone, 8)));
  });

  describe('CurrentSchedule', () => {
    it('should get the current schedule for the specified device', () =>
      device.getCurrentSchedule()
        .then(validateCurrentSchedule));
  });

  describe('Events', () => {
    const startTime = moment().subtract(7, 'days').valueOf();
    const endTime = moment().subtract(3, 'days').valueOf();

    it('should get the events between the start and end times for the specified device', () =>
      device.getEvents(startTime, endTime)
        .then(validateArray(validateEvent, 77)));

    it('should get the events between the start and end times for the specified device using filters', () =>
      device.getEvents(moment().subtract(1, 'days').valueOf(), Date.now(), { category: 'DEVICE' })
        .then(validateArray(validateEvent, 10)));

    it('should default to getting the last 28 days of events', () =>
      device.getEvents()
        .then(validateArray(validateEvent, 193)));

    it('should throw an error when trying to get events older than 28 days', () =>
      device.getEvents(moment().subtract(29, 'days').valueOf())
        .catch(validateError));
  });

  describe('Forecasts and Conditions', () => {
    before(setupFixtures(Fixtures.DeviceForecast));
    after(teardownFixtures);

    describe('getCurrentConditions', () => {
      describe('CurrentConditions.refresh', () => {
        it('should refresh the current conditions', () =>
          device.getCurrentConditions()
            .then(validateCurrentConditions)
            .then(currentConditions => currentConditions.refresh()
              .then(validateCurrentConditions)
              .then(conditionRefresh => {
                conditionRefresh.should.not.eql(currentConditions);
                conditionRefresh.localizedTimeStamp
                  .should.be.greaterThan(currentConditions.localizedTimeStamp);
              })));
      });
    });
    describe('getForecast', () => {
      it('should get the forecast for the specified device (14 days)', () =>
        device.getForecast()
          .then(validateArray(validateForecast, 14)));

      it('should get today\'s forecast for the specified device', () =>
        device.getForecastToday()
          .then(validateForecast));

      it('should get tomorrow\'s forecast for the specified device', () =>
        device.getForecastTomorrow()
          .then(validateForecast));

      it('should get the forecast for the specified device on the given day', () =>
        device.getForecast(moment().add(2, 'day').valueOf())
          .then(validateArray(validateForecast, 1)));

      it('should get the forecast for the specified device on the given days', () =>
        device.getForecast(moment().add(1, 'day').valueOf(), moment().add(4, 'day').valueOf())
          .then(validateArray(validateForecast, 4)));
    });
  });
});
