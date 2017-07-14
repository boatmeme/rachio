const _ = require('lodash');
const { UrlInterpolator } = require('../utils');

class Resource {
  constructor(baseUrl, dataStore, data = {}, childPropertyMap = {}) {
    this._baseUrl = baseUrl;
    this._dataStore = dataStore;
    this._instantiate = newData => Resource.instantiate(this.constructor, this._dataStore, newData);
    this._buildUrl = UrlInterpolator(this._baseUrl);
    Object.assign(this, this.mapChildProps(data, childPropertyMap));
  }

  get(urlObj, qs = {}, headers = {}) {
    return this._dataStore.get(this._buildUrl(urlObj), qs, headers)
      .then(this._instantiate);
  }

  static instantiate(ConstructorFn, dataStore, data) {
    return _.isArray(data)
      ? _.map(data, d => new ConstructorFn(dataStore, d))
      : new ConstructorFn(dataStore, data);
  }

  mapChildProps(data, childPropertyMap = {}) {
    const filteredChildPropertyMap = _.pick(
      childPropertyMap,
      _.intersection(Object.keys(data), Object.keys(childPropertyMap)));

    return Object.assign({},
      data,
      _.mapValues(
        filteredChildPropertyMap,
        (ConstructorFn, prop) => Resource.instantiate(ConstructorFn, this._dataStore, data[prop])));
  }

  toPlainObject() {
    return _.mapValues(_.omit(this, Object.keys(this).filter(k => k.startsWith('_')).concat(Object.keys(Object.getPrototypeOf(this)))), (val) => {
      if (_.isArray(val)) return val.map(v => (v instanceof Resource ? v.toPlainObject() : v));
      return (val instanceof Resource ? val.toPlainObject() : val);
    });
  }

  toJson() {
    return JSON.stringify(this.toPlainObject());
  }
}

module.exports = Resource;
