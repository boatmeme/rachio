const nock = require('nock'); // eslint-disable-line
const _ = require('lodash');

const { StartOfDay } = require('../../lib/utils');
const PersonInfo = require('./person_info.json');
const Person = require('./person.json');
const CurrentSchedule = require('./current_schedule.json');
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
    forecast: _.map(data.forecast,
      f => Object.assign({},
        f,
        { localizedTimeStamp: f.localizedTimeStamp + forecastDateOffset })),
  });
};

OffsetForecast(Forecast);
OffsetForecast(ForecastUpdate);

const getQuery = (uri = '') =>
  _.reduce((_.last(uri.split('?')) || '').split('&'),
    (acc, pair) => {
      const [key, val] = pair.split('=');
      return key && val ? Object.assign(acc, { [key]: val }) : acc;
    },
    {});

const filterByBounds = (arr, prop, lower, upper) =>
  _.filter(arr, o => o[prop] >= lower && o[prop] <= upper);

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
    .get('/1/public/device/2a5e7d3c-c140-4e2e-91a1-a212a518adc5/forecast').times(5)
    .query(true)
    .reply(200, Forecast)
    .get('/1/public/device/RefreshCurrentConditions/forecast')
    .query(true)
    .reply(200, Forecast)
    .get('/1/public/device/RefreshCurrentConditions/forecast')
    .query(true)
    .reply(200, ForecastUpdate);

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
    .put('/1/public/zone/start', { id: 'f0e042bd-7ba1-4aba-bede-6d8b16857d3a', duration: /[0-9].+/ })
    .reply(() => {
      ZoneWateringSchedule = CurrentSchedule;
      return [204];
    });
};

module.exports = {
  setupFixtures,
  teardownFixtures,
  Fixtures,
};
