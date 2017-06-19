'use strict';

const request = require('request');

const call = opts => new Promise((resolve, reject) => request(opts, (err, { statusCode }, body) =>
  (err || statusCode >= 400 ?
    reject({ status: statusCode, errors: (err ? [err] : body.errors) }) :
    resolve(body))));

const get = opts => call(Object.assign({}, opts, { method: 'GET' }));

class ApiUtils {
  constructor({ baseUri = '', headers = {} }) {
    this.baseUri = baseUri;
    this.headers = headers;
  }

  get({ endpoint = '/', headers, qs }) {
    return get({ uri: `${this.baseUri}${endpoint}`, headers: Object.assign({}, this.headers, headers), qs, json: true });
  }
  /*
  post({ endpoint = '/', headers }, body) {

  }
  put({ endpoint = '/', headers }, body) {

  }
  delete({ endpoint = '/', headers }) {

  }
  */
}

module.exports = ApiUtils;
