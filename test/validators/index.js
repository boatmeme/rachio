const {
  Resource,
  Zone,
  Event,
  Forecast,
  CurrentConditions,
  CurrentSchedule,
  Device,
  Person,
  MultiZone,
  ScheduleRule,
  FlexScheduleRule,
} = require('../../lib/resource');
const { isNumber } = require('../../lib/utils');

exports.validateZone = function validateZone(zone) {
  zone.should.be.an.Object().instanceOf(Zone).and.instanceOf(Resource);
  return zone;
};

exports.validateScheduleRule = function validateScheduleRule(rule) {
  rule.should.be.an.Object().instanceOf(ScheduleRule).and.instanceOf(Resource);
  return rule;
};

exports.validateFlexScheduleRule = function validateFlexScheduleRule(rule) {
  rule.should.be.an.Object().instanceOf(FlexScheduleRule).and.instanceOf(Resource);
  return rule;
};

exports.validateEvent = function validateEvent(event) {
  event.should.be.an.Object().instanceOf(Event).and.instanceOf(Resource);
  return event;
};

exports.validateCurrentSchedule = function validateCurrentSchedule(currentSchedule) {
  currentSchedule.should.be.an.Object().instanceOf(CurrentSchedule).and.instanceOf(Resource);
  return currentSchedule;
};

exports.validateForecast = function validateForecast(forecast) {
  forecast.should.be.an.Object().instanceOf(Forecast).and.instanceOf(Resource);
  return forecast;
};

exports.validateCurrentConditions = function validateCurrentConditions(currentConditions) {
  currentConditions.should.be.an.Object().instanceOf(CurrentConditions).and.instanceOf(Resource);
  return currentConditions;
};

exports.validateDevice = function validateDevice(device) {
  device.should.be.an.Object().instanceOf(Device).and.instanceOf(Resource);
  device.should.have.property('zones').is.an.Array();
  device.zones.forEach(exports.validateZone);
  return device;
};

exports.validateError = function validateError(error) {
  error.should.be.an.Error();
  return error;
};

exports.validatePerson = function validatePerson(person) {
  person.should.be.an.Object().instanceOf(Person);
};

exports.validateMultiZone = function validateMultiZone(multi) {
  multi.should.be.an.Object().instanceOf(MultiZone);
};

exports.validateArray = function validateArray(validationFn, length) {
  return arr => {
    if (isNumber(length)) {
      arr.should.be.an.Array().of.length(length);
    } else {
      arr.should.be.an.Array();
    }
    arr.forEach(validationFn);
  };
};
