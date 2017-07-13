const should = require('should');
const { Resource } = require('../lib/resource');
const RefreshableResourceMixin = require('../lib/resource/RefreshableResourceMixin');

describe('RefreshableResourceMixin', () => {
  it('should apply to any subclass of Resource', () => {
    class RandoClass extends Resource {
      constructor(calls = 0) { super('/resource'); this.calls = calls; }
      get(number = 0) {
        return new RandoClass(this.calls + number);
      }
    }

    let obj = new (RefreshableResourceMixin(RandoClass))();
    obj.calls.should.be.eql(0);
    obj.refresh().calls.should.eql(0);

    obj = obj.get(3);
    obj.calls.should.be.eql(3);
    obj.refresh().calls.should.be.eql(6);
  });
  
  it('should throw an error if applied to any class other than a subclass of Resource', () => {
    class RandoClass {
      get() {
        return this;
      }
    }
    should(() => RefreshableResourceMixin(RandoClass)).throw('RefreshableResourceMixin cannot be applied to RandoClass');
  });
});
