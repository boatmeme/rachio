const should = require('should');
const Rachio = require('../');
const {
  setupFixtures,
  teardownFixtures,
  Fixtures,
} = require('./fixtures');

const { validateError, validateScheduleRule } = require('./validators');

const apiToken = process.env.RACHIO_API_TOKEN || '8e600a4c-0027-4a9a-9bda-dc8d5c90350d';
const client = new Rachio(apiToken);
const scheduleRuleId = 'f887ce96-3103-4774-9de9-6c66a725de18';

describe('ScheduleRule', () => {
  before(setupFixtures(Fixtures.ScheduleRule));

  after(teardownFixtures);

  describe('skip', () => {
    it('should disable a schedule rule', () =>
      client.getScheduleRule(scheduleRuleId)
        .then(validateScheduleRule)
        .then(rule => {
          rule.should.have.property('enabled').is.true();
          return rule.skip()
            .then(() => rule.refresh())
            .then(r => {
              r.should.have.property('enabled').is.false();
            });
        }));
  });

  describe('start', () => {
    it('should enable a schedule rule', () =>
      client.getScheduleRule(scheduleRuleId)
        .then(validateScheduleRule)
        .then(rule => {
          rule.should.have.property('enabled').is.false();
          return rule.start()
            .then(() => rule.refresh())
            .then(r => {
              r.should.have.property('enabled').is.true();
            });
        }));
  });

  describe('seasonalAdjustment', () => {
    it('should set a seasonal adjustment for a schedule rule', () =>
      client.getScheduleRule(scheduleRuleId)
        .then(validateScheduleRule)
        .then(rule => {
          rule.should.have.property('seasonalAdjustment').is.eql(0);
          return rule.setSeasonalAdjustment(0.5)
            .then(() => rule.refresh())
            .then(r => {
              r.should.have.property('seasonalAdjustment').is.eql(0.5);
            });
        }));

    it('should error for invalid adjustment values', () =>
      client.getScheduleRule(scheduleRuleId)
        .then(validateScheduleRule)
        .then(rule => Promise.all([
          rule.setSeasonalAdjustment(-5).catch(validateError),
          rule.setSeasonalAdjustment(2).catch(validateError),
        ])));
  });
});
