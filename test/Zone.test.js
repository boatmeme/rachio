const should = require('should');
const Rachio = require('../');
const {
  setupFixtures,
  teardownFixtures,
  Fixtures,
} = require('./fixtures');
const { validateZone, validateDevice } = require('./validators');

const apiToken = process.env.RACHIO_API_TOKEN || '8e600a4c-0027-4a9a-9bda-dc8d5c90350d';
const client = new Rachio(apiToken);

describe('Zone', () => {
  let deviceZone;

  before(() => {
    setupFixtures(Fixtures.Zone)();
    return client.getDevices()
      .then(([device]) => client.getZonesByDevice(device.id))
      .then(zones => {
        deviceZone = zones[2];
      });
  });

  after(teardownFixtures);

  describe('get / refresh', () => {
    it('should get a zone', () =>
      client.getZone(deviceZone.id)
        .then(validateZone));

    it('should refresh a zone', () =>
      client.getZone(deviceZone.id)
        .then(validateZone)
        .then(zone => zone.refresh()
          .then(validateZone)
          .then(refreshedZone => {
            refreshedZone.should.not.eql(zone);
            refreshedZone.should.have.property('enabled').is.false();
            zone.should.have.property('enabled').is.true();
          })));

    it('should get the zone\'s device', () =>
      client.getZone(deviceZone.id)
        .then(validateZone)
        .then(zone => zone.getDevice())
        .then(validateDevice));
  });

  describe('start', () => {
    it('should start a zone watering', () =>
      client.getZone(deviceZone.id)
        .then(validateZone)
        .then(zone =>
          zone.isWatering()
            .then(isWatering => isWatering.should.be.false())
            .then(() => zone.start())
            .then(() => zone.isWatering())
            .then(isWatering => isWatering.should.be.true())
            .then(() => zone.stop())
            .then(() => zone.isWatering())
            .then(isWatering => isWatering.should.be.false())));
  });
});
