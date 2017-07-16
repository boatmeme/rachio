const nock = require('nock'); // eslint-disable-line
const { map, reduce, last } = require('../../lib/utils');

const { StartOfDay } = require('../../lib/utils');
const PersonInfo = require('./person_info.json');
const Person = require('./person.json');
const CurrentSchedule = require('./current_schedule.json');
const FlexScheduleRule = require('./flex_schedule_rule.json');
const ScheduleRule = require('./schedule_rule.json');
const Forecast = require('./forecast.json');
const ForecastUpdate = require('./forecast_update.json');
const Zone = require('./zone.json');
const ZoneUpdate = require('./zone_update.json');
const Events = require('./events.json');
const Device = require('./device.json');

const forecastDateOffset = (StartOfDay(Date.now()) + 46800000) - 1499691600000;
const eventDateOffset = Date.now() - 1499464193439;

const OffsetForecast = data => {
  Object.assign(data, {
    current: Object.assign({},
      data.current,
      { localizedTimeStamp: data.current.localizedTimeStamp + forecastDateOffset }),
    forecast: map(data.forecast,
      f => Object.assign({},
        f,
        { localizedTimeStamp: f.localizedTimeStamp + forecastDateOffset })),
  });
};

OffsetForecast(Forecast);
OffsetForecast(ForecastUpdate);

const getQuery = (uri = '') =>
  reduce((last(uri.split('?')) || '').split('&'),
    (acc, pair) => {
      const [key, val] = pair.split('=');
      return key && val ? Object.assign(acc, { [key]: val }) : acc;
    },
    {});

const filterByBounds = (arr = [], prop, lower, upper) =>
  arr.filter(o => o[prop] >= lower && o[prop] <= upper);

const setupFixtures = fixture => () => {
  nock.disableNetConnect();
  fixture.call(null);
};

const teardownFixtures = () => {
  nock.cleanAll();
  nock.enableNetConnect();
};

const Fixtures = {};

Fixtures.Generic = () =>
  nock('https://api.rach.io')
    .persist()
    .get('/1/public/person/info')
    .reply(200, PersonInfo)
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5')
    .reply(200, Device)
    .get('/1/public/person/c8d10892-fd69-48b3-8743-f111e4392d8a')
    .reply(200, Person)
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5/current_schedule')
    .reply(200, CurrentSchedule)
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5/event')
    .query(true)
    .reply(uri => {
      const { startTime, endTime } = getQuery(uri);
      return [200, filterByBounds(Events, 'eventDate', startTime - eventDateOffset, endTime - eventDateOffset)];
    });

Fixtures.Forecast = () =>
  nock('https://api.rach.io')
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5/forecast')
    .times(5)
    .query(true)
    .reply(200, Forecast)
    .get('/1/public/device/RefreshCurrentConditions/forecast')
    .query(true)
    .reply(200, Forecast)
    .get('/1/public/device/RefreshCurrentConditions/forecast')
    .query(true)
    .reply(200, ForecastUpdate);

Fixtures.DeviceForecast = () =>
  nock('https://api.rach.io')
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5/forecast')
    .query(true)
    .reply(200, Forecast)
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5/forecast')
    .query(true)
    .reply(200, ForecastUpdate)
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5/forecast')
    .times(5)
    .query(true)
    .reply(200, Forecast);

Fixtures.DeviceWatering = () => {
  let ZoneWateringSchedule = {};
  return nock('https://api.rach.io')
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5/current_schedule')
    .times(3)
    .reply(() => ([200, ZoneWateringSchedule]))
    .put('/1/public/device/stop_water', { id: '2a5e7d3c-c140-4e2e-91a1-a212a518adc5' })
    .reply(() => {
      ZoneWateringSchedule = {};
      return [204];
    })
    .put('/1/public/zone/start', { id: 'ec47f4a6-5771-4d8f-834a-89bc7d889ea4', duration: /[0-9]+/ })
    .reply(() => {
      ZoneWateringSchedule = CurrentSchedule;
      return [204];
    });
};

Fixtures.DeviceStandby = () => {
  let enabled = true;
  return nock('https://api.rach.io')
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5')
    .times(2)
    .reply(() => ([200, Object.assign({}, Device, { enabled })]))
    .put('/1/public/device/off', { id: '2a5e7d3c-c140-4e2e-91a1-a212a518adc5' })
    .reply(() => {
      enabled = false;
      return [204];
    })
    .put('/1/public/device/on', { id: '2a5e7d3c-c140-4e2e-91a1-a212a518adc5' })
    .reply(() => {
      enabled = true;
      return [204];
    });
};

Fixtures.RainDelay = () => {
  let rainDelayStartDate = 1499458431922;
  let rainDelayExpirationDate = 1499458431922;

  return nock('https://api.rach.io')
    .persist()
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5')
    .reply(() =>
      ([200, Object.assign({}, Device, { rainDelayStartDate, rainDelayExpirationDate })]))
    .put('/1/public/device/rain_delay', { id: '2a5e7d3c-c140-4e2e-91a1-a212a518adc5', duration: /[0-9]+/ })
    .reply((uri, body) => {
      rainDelayStartDate = Date.now();
      rainDelayExpirationDate = rainDelayStartDate + (body.duration * 1000);
      return [204];
    });
};

Fixtures.IsRaining = () => {
  const setProbability = precipProbability => Object.assign(
    {},
    Forecast,
    { current: Object.assign({}, Forecast.current, { precipProbability }) });

  return nock('https://api.rach.io')
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5/forecast')
    .query(true)
    .reply(() => ([200, setProbability(0.98)]))
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5/forecast')
    .query(true)
    .reply(() => ([200, setProbability(0.99)]))
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5/forecast')
    .query(true)
    .reply(() => ([200, setProbability(0.74)]))
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5/forecast')
    .query(true)
    .reply(() => ([200, setProbability(1)]));
};

Fixtures.ForecastNextRain = () =>
  nock('https://api.rach.io')
    .persist()
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5/forecast')
    .query(true)
    .reply(200, Forecast);

Fixtures.Zone = () => {
  let ZoneWateringSchedule = {};
  return nock('https://api.rach.io')
    .get('/1/public/person/info')
    .times(3)
    .reply(200, PersonInfo)
    .get('/1/public/person/c8d10892-fd69-48b3-8743-f111e4392d8a')
    .times(3)
    .reply(200, Person)
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5')
    .times(3)
    .reply(200, Device)
    .get('/1/public/zone/f0e042bd-7ba1-4aba-bede-6d8b16857d3a')
    .reply(200, Zone)
    .get('/1/public/zone/f0e042bd-7ba1-4aba-bede-6d8b16857d3a')
    .reply(200, Zone)
    .get('/1/public/zone/f0e042bd-7ba1-4aba-bede-6d8b16857d3a')
    .reply(200, ZoneUpdate)
    .get('/1/public/zone/f0e042bd-7ba1-4aba-bede-6d8b16857d3a')
    .times(4)
    .reply(200, Zone)
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5/current_schedule')
    .times(3)
    .reply(() => ([200, ZoneWateringSchedule]))
    .put('/1/public/device/stop_water', { id: '2a5e7d3c-c140-4e2e-91a1-a212a518adc5' })
    .reply(() => {
      ZoneWateringSchedule = {};
      return [204];
    })
    .put('/1/public/zone/start', { id: 'f0e042bd-7ba1-4aba-bede-6d8b16857d3a', duration: /[0-9]+/ })
    .reply(() => {
      ZoneWateringSchedule = CurrentSchedule;
      return [204];
    });
};

Fixtures.MultiZone = () => {
  let ZoneWateringSchedule = {};
  return nock('https://api.rach.io')
    .get('/1/public/person/info')
    .times(2)
    .reply(200, PersonInfo)
    .get('/1/public/person/c8d10892-fd69-48b3-8743-f111e4392d8a')
    .times(2)
    .reply(200, Person)
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5')
    .times(2)
    .reply(200, Device)
    .get('/1/public/zone/f0e042bd-7ba1-4aba-bede-6d8b16857d3a')
    .times(3)
    .reply(200, Zone)
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5/current_schedule')
    .times(3)
    .reply(() => ([200, ZoneWateringSchedule]))
    .put('/1/public/device/stop_water', { id: '2a5e7d3c-c140-4e2e-91a1-a212a518adc5' })
    .reply(() => {
      ZoneWateringSchedule = {};
      return [204];
    })
    .put('/1/public/zone/start_multiple', { zones:
       [{ id: 'f0e042bd-7ba1-4aba-bede-6d8b16857d3a', duration: 60 },
         { id: '8de4dbf6-7a52-43b0-9c18-7d074b868f67', duration: 120 },
         { id: '1f3759cf-8722-4331-8859-aef4e328ce51', duration: 180 }] })
    .reply(() => {
      ZoneWateringSchedule = CurrentSchedule;
      return [204];
    });
};

Fixtures.ScheduleRule = () => {
  let enabled = true;
  let seasonalAdjustment = 0;

  return nock('https://api.rach.io')
    .persist()
    .get('/1/public/schedulerule/f887ce96-3103-4774-9de9-6c66a725de18')
    .reply(() => [200, Object.assign({}, ScheduleRule, { enabled, seasonalAdjustment })])
    .put('/1/public/schedulerule/skip', { id: 'f887ce96-3103-4774-9de9-6c66a725de18' })
    .reply(() => {
      enabled = false;
      return [204];
    })
    .put('/1/public/schedulerule/start', { id: 'f887ce96-3103-4774-9de9-6c66a725de18' })
    .reply(() => {
      enabled = true;
      return [204];
    })
    .put('/1/public/schedulerule/seasonal_adjustment', { id: 'f887ce96-3103-4774-9de9-6c66a725de18', adjustment: /[.09]+/ })
    .reply((uri, body) => {
      seasonalAdjustment = body.adjustment;
      return [204];
    });
};

Fixtures.FlexScheduleRule = () =>
  nock('https://api.rach.io')
    .get('/1/public/flexschedulerule/6ede2d28-6823-48c7-8398-82bb07b979e3')
    .reply(() => [200, Object.assign({}, FlexScheduleRule, { enabled: true })])
    .get('/1/public/flexschedulerule/6ede2d28-6823-48c7-8398-82bb07b979e3')
    .reply(() => [200, Object.assign({}, FlexScheduleRule, { enabled: false })]);

Fixtures.Error = () =>
  nock('https://api.rach.io')
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5')
    .reply(() => [404, { error: 'Not Found', code: 404 }])
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5')
    .reply(() => [401, { errors: [{ message: 'Unauthorized' }] }])
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5')
    .replyWithError({ message: 'something awful happened', code: 'AWFUL_ERROR' })
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5')
    .reply(500);

module.exports = {
  setupFixtures,
  teardownFixtures,
  Fixtures,
};
