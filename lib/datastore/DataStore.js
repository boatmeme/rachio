const request = require('request');
const { get } = require('../utils');
const debug = require('debug')('rachio.DataStore');

const getErrorArr = (err, body) => {
  if (err) {
    return [err.message || err];
  }
  if (body && body.error) {
    return [body.error];
  }
  if (body && body.errors) {
    return body.errors.map(e => e.message || e);
  }
  return ['Unknown Error'];
};

const http = opts => new Promise((resolve, reject) => {
  debug('http.Request %s %s', opts.method, opts.uri);
  return request(opts, (err, res, body) => {
    const statusCode = get(res, 'statusCode', 500);
    if (err || statusCode >= 400) {
      const errorObj = { status: statusCode, errors: getErrorArr(err, body) };
      debug('http.Error: [%d] %s %s\n  %j', statusCode, opts.method, opts.uri, errorObj);
      return reject(new Error(`${errorObj.errors} [${statusCode}] ${opts.method} ${opts.uri}`));
    }
    debug('http.Response [%d] %s %s', statusCode, opts.method, opts.uri);
    return resolve(body || true);
  });
});


class DataStore {
  constructor(baseUrl, headers = {}) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  get(url, qs = {}, headers = {}) {
    return http({ method: 'GET',
      uri: `${this.baseUrl}/${url}`,
      headers: Object.assign({}, this.headers, headers),
      qs,
      json: true });
  }

  put(url, json = {}, qs = {}, headers = {}) {
    return http({ method: 'PUT',
      uri: `${this.baseUrl}/${url}`,
      headers: Object.assign({}, this.headers, headers),
      qs,
      json });
  }
}

module.exports = DataStore;
