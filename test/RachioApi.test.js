'use strict';

const should = require('should');
const Rachio = require('../');
const moment = require('moment');

const apiToken = process.env.RACHIO_API_TOKEN;

describe('Rachio', () => {
  let client;
  let deviceId;

  before(() => {
    client = new Rachio(apiToken);
    return client.getDevices()
      .then(([device]) => {
        deviceId = device.id;
      });
  });

  describe('Person API', () => {
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
          .then(user => {
            user.should.be.ok().and.an.Object();
          }));
    });
  });
  describe('Device API', () => {
    describe('getDevices', () => {
      it('should get the currently authenticated user\'s devices', () =>
        client.getDevices()
          .then(devices => {
            devices.should.be.an.Array();
          }));
    });
    describe('getDeviceCurrentSchedule', () => {
      it('should get the current schedule for the specified device', () =>
        client.getDeviceCurrentSchedule(deviceId)
          .then(schedule => {
            schedule.should.be.an.Object();
          }));
    });
    describe('getDeviceEvents', () => {
      it('should get the events between the start and end times for the specified device', () => {
        const now = moment();
        return client.getDeviceEvents(deviceId, now.subtract(7, 'days').valueOf(), now.add(7, 'days').valueOf())
          .then(events => {
            events.should.be.an.Array();
          });
      });
      it('should get the events between the start and end times for the specified device using filters', () => {
        const now = moment();
        return client.getDeviceEvents(deviceId, now.subtract(7, 'days').valueOf(), now.add(7, 'days').valueOf(), { category: 'DEVICE' })
          .then(events => {
            events.should.be.an.Array();
          });
      });
    });
    describe('getDeviceCurrentConditions', () => {
      it('should get the current conditions for the specified device', () =>
        client.getDeviceCurrentConditions(deviceId)
          .then(conditions => {
            conditions.should.be.an.Object();
          }));
    });
    describe('getDeviceForecast', () => {
      it('should get the forecast for the specified device', () =>
        client.getDeviceForecast(deviceId)
          .then(forecast => {
            forecast.should.be.an.Array();
          }));
      it('should get today\'s forecast for the specified device on the given day', () =>
        client.getDeviceForecastToday(deviceId)
          .then(forecast => {
            forecast.should.be.ok().and.an.Object();
          }));
      it('should get the forecast for the specified device on the given day', () =>
        client.getDeviceForecast(deviceId, moment().add(1, 'day').valueOf())
          .then(forecast => {
            forecast.should.be.an.Array().of.length(1);
          }));
      it('should get the forecast for the specified device on the given days', () =>
        client.getDeviceForecast(deviceId, moment().add(1, 'day').valueOf(), moment().add(4, 'day').valueOf())
          .then(forecast => {
            forecast.should.be.an.Array().of.length(3);
          }));
    });
  });
  describe('Zones API', () => {
    describe('getZonesForDevice', () => {
      it('should get the zones for the specified device', () =>
        client.getZonesByDevice(deviceId)
          .then(zones => {
            zones.should.be.an.Array();
          }));
    });
  });
  describe('Webhooks API', () => {
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
