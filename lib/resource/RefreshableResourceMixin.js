/* eslint no-param-reassign: 0 */
/* eslint no-underscore-dangle: 0 */
const Resource = require('./Resource');

function RefreshableResourceMixin(TargetClass) {
  if (!(TargetClass.prototype instanceof Resource)) {
    throw new Error(`RefreshableResourceMixin cannot be applied to ${TargetClass.name}`);
  }

  TargetClass.prototype._proxiedGet = TargetClass.prototype.get;

  TargetClass.prototype.get = function refreshableGet() {
    const args = Array.from(arguments);
    const maybePromise = this._proxiedGet.call(this, ...args);
    return maybePromise instanceof Promise
      ? maybePromise.then(obj => Object.assign(obj, { _refreshArgs: args }))
      : Object.assign(maybePromise, { _refreshArgs: args });
  };

  TargetClass.prototype.refresh = function refresh() {
    return this.get.call(this, ...(this._refreshArgs || []));
  };

  return TargetClass;
}

module.exports = RefreshableResourceMixin;
