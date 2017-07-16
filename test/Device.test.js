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
  validateCurrentSchedule,
  validateEvent,
  validateError,
  validateForecast,
  validateCurrentConditions,
  validateZone,
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

  describe('Watering', () => {
    before(setupFixtures(Fixtures.DeviceWatering));
    after(teardownFixtures);

    describe('isWatering', () => {
      it('should report the correct status if a zone is watering', () => {
        const zone = device.zones[2];
        return device.isWatering()
          .then(isWatering => isWatering.should.be.false())
          .then(() => zone.start())
          .then(() => device.isWatering())
          .then(isWatering => isWatering.should.be.true())
          .then(() => device.stopWater())
          .then(() => device.isWatering())
          .then(isWatering => isWatering.should.be.false());
      });
    });
  });

  describe('Standby', () => {
    before(setupFixtures(Fixtures.DeviceStandby));
    after(teardownFixtures);

    describe('standbyOn/Off', () => {
      it('should report the correct status if a device is in standby', () =>
        device.standbyOn()
          .then(() => device.refresh())
          .then(d => d.should.have.property('enabled').is.false())
          .then(() => device.standbyOff())
          .then(() => device.refresh())
          .then(d => d.should.have.property('enabled').is.true()));
    });
  });

  describe('Rain Forecast Functions', () => {
    describe('isRaining', () => {
      before(setupFixtures(Fixtures.IsRaining));
      after(teardownFixtures);

      it('should return boolean if currently raining (default threshold)', () =>
        device.isRaining()
          .then(isRaining => isRaining.should.be.false())
          .then(() => device.isRaining())
          .then(isRaining => isRaining.should.be.true()));

      it('should return boolean if currently raining (user-defined threshold)', () =>
        device.isRaining(0.75)
          .then(isRaining => isRaining.should.be.false())
          .then(() => device.isRaining(0.75))
          .then(isRaining => isRaining.should.be.true()));
    });

    describe.only('getForecastNextRain', () => {
      before(setupFixtures(Fixtures.ForecastNextRain));
      after(teardownFixtures);

      it('should return Forecast if rain in the forecast (default threshold)', () =>
        device.getForecastNextRain()
          .then(validateForecast)
          .then(nextRainDay => nextRainDay.should.have.property('precipProbability').is.Number().aboveOrEqual(0.25)));

      it('should return Forecast if rain in the forecast (user-defined threshold)', () =>
        device.getForecastNextRain(0.35)
          .then(validateForecast)
          .then(nextRainDay => nextRainDay.should.have.property('precipProbability').is.Number().aboveOrEqual(0.35)));

      it('should return false if no rain in the forecast >= threshold', () =>
        device.getForecastNextRain(0.9)
          .then(nextRainDay => nextRainDay.should.be.false()));
    });
  });

  describe('RainDelay', () => {
    before(setupFixtures(Fixtures.RainDelay));
    after(teardownFixtures);

    describe('rainDelay', () => {
      it('should register a rainDelay of 1 Day as a default', () => {
        const now = Date.now() - 1;
        return device.rainDelay()
          .then(() => device.refresh())
          .then(d => {
            d.should.have.property('rainDelayStartDate').is.a.Number().greaterThan(now);
            d.should.have.property('rainDelayExpirationDate').is.a.Number().greaterThan(d.rainDelayStartDate);
            should(d.rainDelayExpirationDate - d.rainDelayStartDate).be.eql(86400 * 1000);
          });
      });

      it('should register a rainDelay', () => {
        const now = Date.now() - 1;
        const delayLength = 60;
        return device.rainDelay(60)
          .then(() => device.refresh())
          .then(d => {
            d.should.have.property('rainDelayStartDate').is.a.Number().greaterThan(now);
            d.should.have.property('rainDelayExpirationDate').is.a.Number().greaterThan(d.rainDelayStartDate);
            should(d.rainDelayExpirationDate - d.rainDelayStartDate).be.eql(delayLength * 1000);
          });
      });

      it('should error for invalid rainDelays', () =>
        device.rainDelay(-1)
          .catch(validateError)
          .then(() => device.rainDelay(100000000))
          .catch(validateError));
    });

    describe('rainDelayCancel', () => {
      it('should disable an existing RainDelay', () => {
        const now = Date.now() - 1;
        return device.rainDelay()
          .then(() => device.refresh())
          .then(d => {
            d.should.have.property('rainDelayStartDate').is.a.Number().greaterThan(now);
            d.should.have.property('rainDelayExpirationDate').is.a.Number().greaterThan(d.rainDelayStartDate);
            should(d.rainDelayExpirationDate - d.rainDelayStartDate).be.eql(86400 * 1000);
          })
          .then(() => device.rainDelayCancel())
          .then(() => device.refresh())
          .then(d => {
            d.should.have.property('rainDelayStartDate').is.a.Number().greaterThan(now);
            d.should.have.property('rainDelayExpirationDate').is.a.Number().eql(d.rainDelayStartDate);
          });
      });
    });
  });
});
