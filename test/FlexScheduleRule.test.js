const should = require('should');
const Rachio = require('../');
const {
  setupFixtures,
  teardownFixtures,
  Fixtures,
} = require('./fixtures');

const { validateFlexScheduleRule } = require('./validators');

const apiToken = process.env.RACHIO_API_TOKEN || '8e600a4c-0027-4a9a-9bda-dc8d5c90350d';
const client = new Rachio(apiToken);
const flexScheduleRuleId = '6ede2d28-6823-48c7-8398-82bb07b979e3';

describe('FlexScheduleRule', () => {
  before(setupFixtures(Fixtures.FlexScheduleRule));

  after(teardownFixtures);

  describe('get / refresh', () => {
    it('should get a flex schedule rule that is refreshable', () =>
      client.getFlexScheduleRule(flexScheduleRuleId)
        .then(validateFlexScheduleRule)
        .then(rule => {
          rule.should.have.property('enabled').is.true();
          return rule.refresh()
            .then(r => {
              r.should.have.property('enabled').is.false();
            });
        }));
  });
});
