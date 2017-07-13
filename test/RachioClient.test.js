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
  validatePerson,
  validateDevice,
  validateCurrentSchedule,
  validateEvent,
  validateError,
  validateForecast,
  validateCurrentConditions,
  validateZone,
} = require('./validators');

const apiToken = process.env.RACHIO_API_TOKEN || '8e600a4c-0027-4a9a-9bda-dc8d5c90350d';


describe('Rachio', () => {
  let client;
  let deviceId;

  describe('Person API', () => {
    before(() => {
      setupFixtures(Fixtures.Generic)();
      client = new Rachio(apiToken);
      return client.getDevices()
        .then(([device]) => {
          deviceId = device.id;
        });
    });
    after(teardownFixtures);

    describe('getPersonInfo', () => {
      it('should get the currently authenticated user id', () =>
        client.getPersonInfo()
          .then(result => {
            result.should.have.property('id').is.a.String();
          }));
    });
    describe('getPerson', () => {
      it('should get the currently authenticated user id', () =>
        client.getPersonInfo()
          .then(({ id }) => client.getPerson(id))
          .then(validatePerson));
    });
  });
  describe('Device API', () => {
    before(() => {
      setupFixtures(Fixtures.Generic)();
      client = new Rachio(apiToken);
      return client.getDevices()
        .then(([device]) => {
          deviceId = device.id;
        });
    });
    after(teardownFixtures);
    describe('getDevices', () => {
      it('should get the currently authenticated user\'s devices', () =>
        client.getDevices()
          .then(validateArray(validateDevice)));
    });

    describe('getDeviceCurrentSchedule', () => {
      it('should get the current schedule for the specified device', () =>
        client.getDeviceCurrentSchedule(deviceId)
          .then(validateCurrentSchedule));
    });
    describe('getDeviceEvents', () => {
      const startTime = moment().subtract(7, 'days').valueOf();
      const endTime = moment().subtract(3, 'days').valueOf();

      it('should get the events between the start and end times for the specified device', () =>
        client.getDeviceEvents(deviceId, startTime, endTime)
          .then(validateArray(validateEvent, 77)));

      it('should get the events between the start and end times for the specified device using filters', () =>
        client.getDeviceEvents(deviceId, moment().subtract(1, 'days').valueOf(), Date.now(), { category: 'DEVICE' })
          .then(validateArray(validateEvent, 10)));

      it('should default to getting the last 28 days of events', () =>
        client.getDeviceEvents(deviceId)
          .then(validateArray(validateEvent, 193)));

      it('should throw an error when trying to get events older than 28 days', () =>
        client.getDeviceEvents(deviceId, moment().subtract(29, 'days').valueOf())
          .catch(validateError));
    });

    describe('Forecasts and Conditions', () => {
      before(setupFixtures(Fixtures.Forecast));
      after(teardownFixtures);

      describe('getDeviceCurrentConditions', () => {
        describe('CurrentConditions.refresh', () => {
          it('should refresh the current conditions', () =>
            client.getDeviceCurrentConditions('RefreshCurrentConditions')
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
      describe('getDeviceForecast', () => {
        it('should get the forecast for the specified device (14 days)', () =>
          client.getDeviceForecast(deviceId)
            .then(validateArray(validateForecast, 14)));

        it('should get today\'s forecast for the specified device', () =>
          client.getDeviceForecastToday(deviceId)
            .then(validateForecast));

        it('should get tomorrow\'s forecast for the specified device', () =>
          client.getDeviceForecastTomorrow(deviceId)
            .then(validateForecast));

        it('should get the forecast for the specified device on the given day', () =>
          client.getDeviceForecast(deviceId, moment().add(2, 'day').valueOf())
            .then(validateArray(validateForecast, 1)));

        it('should get the forecast for the specified device on the given days', () =>
          client.getDeviceForecast(deviceId, moment().add(1, 'day').valueOf(), moment().add(4, 'day').valueOf())
            .then(validateArray(validateForecast, 4)));
      });
    });
  });
  describe('Zones', () => {
    before(setupFixtures(Fixtures.Zone));
    after(teardownFixtures);

    describe('getZonesForDevice', () => {
      it('should get the zones for the specified device', () =>
        client.getZonesByDevice(deviceId)
          .then(validateArray(validateZone, 8)));
    });
  });
  describe.skip('Webhooks API', () => {
    describe('getWebhookTypes', () => {
      it('should get the available event types for webhooks', () =>
        client.getWebhookTypes()
          .then(eventTypes => {
            eventTypes.should.be.an.Array();
          }));
    });
    describe('getWebhooksByDevice', () => {
      it('should get the webhooks for the specified device', () =>
        client.getWebhooksByDevice(deviceId)
          .then(webhooks => {
            webhooks.should.be.an.Array();
          }));
    });
  });
});
