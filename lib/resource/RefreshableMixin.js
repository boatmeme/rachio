/* eslint no-param-reassign: 0 */
/* eslint no-underscore-dangle: 0 */

function RefreshableMixin(TargetClass) {
  TargetClass.prototype._proxiedGet = TargetClass.prototype.get;

  TargetClass.prototype.get = function refreshableGet() {
    const args = Array.from(arguments);
    return this._proxiedGet.call(this, ...args)
      .then(obj => Object.assign(obj, { _refreshArgs: args }));
  };

  TargetClass.prototype.refresh = function refresh() {
    return this.get.call(this, ...this._refreshArgs);
  };

  return TargetClass;
}

module.exports = RefreshableMixin;
