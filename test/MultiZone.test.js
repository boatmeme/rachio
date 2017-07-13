const should = require('should');
const Rachio = require('../');
const {
  setupFixtures,
  teardownFixtures,
  Fixtures,
} = require('./fixtures');

const { validateError } = require('./validators');

const apiToken = process.env.RACHIO_API_TOKEN || '8e600a4c-0027-4a9a-9bda-dc8d5c90350d';
const client = new Rachio(apiToken);

describe('MultiZone', () => {
  let deviceZones;

  before(() => {
    setupFixtures(Fixtures.MultiZone)();
    return client.getDevices()
      .then(([device]) => client.getZonesByDevice(device.id))
      .then(zones => {
        deviceZones = zones;
      });
  });

  after(teardownFixtures);

  describe('start', () => {
    it('should start a multi-zone watering', () => {
      const multi = client.multiZone();
      multi.add(deviceZones[2], 60)
        .add(deviceZones[3], 120)
        .add(deviceZones[4], 180);

      return client.getZone(deviceZones[2].id)
        .then(zone =>
          zone.isWatering()
            .then(isWatering => isWatering.should.be.false())
            .then(() => multi.start())
            .then(() => zone.isWatering())
            .then(isWatering => isWatering.should.be.true())
            .then(() => zone.stop())
            .then(() => zone.isWatering())
            .then(isWatering => isWatering.should.be.false()));
    });
  });

  describe('get', () => {
    it('should throw an error', () => {
      const multi = client.multiZone();
      multi.get({ id: 'anything' })
        .catch(validateError);
    });
  });
});
