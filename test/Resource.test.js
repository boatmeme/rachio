const should = require('should');
const { values } = require('../lib/utils');
const Rachio = require('../');
const {
  setupFixtures,
  teardownFixtures,
  Fixtures,
} = require('./fixtures');
const {
  Resource,
  Device,
} = require('../lib/resource');

const apiToken = process.env.RACHIO_API_TOKEN || '8e600a4c-0027-4a9a-9bda-dc8d5c90350d';

describe('Resource', () => {
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

  describe('toPlainObject', () => {
    it('should return a plain-old-javascript-object', () => {
      const pojo = new Resource('/baseUrl').toPlainObject();
      pojo.should.be.an.Object();
      pojo.should.not.be.an.instanceOf(Resource);
    });
    it('should return a plain-old-javascript-object with only the properties loaded from the API', () => {
      const pojo = device.toPlainObject();
      pojo.should.be.an.Object();
      pojo.should.not.be.an.instanceOf(Resource).and.not.an.instanceOf(Device);
      values(pojo, v => v.should.not.be.an.instanceOf(Function));
      Object.keys(pojo).forEach(k => k.startsWith('_').should.be.false());
    });
  });
  describe('toJson', () => {
    it('should return a JSON string', () => {
      const json = new Resource('/baseUrl').toJson();
      json.should.be.a.String();
      const pojo = JSON.parse(json);
      pojo.should.be.an.Object();
    });
    it('should return a JSON string with only the properties loaded from the API', () => {
      const json = device.toJson();
      json.should.be.a.String();
      const pojo = JSON.parse(json);
      pojo.should.be.an.Object();
      values(pojo, v => v.should.not.be.an.instanceOf(Function));
      Object.keys(pojo).forEach(k => k.startsWith('_').should.be.false());
    });
  });
});
