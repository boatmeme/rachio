const request = require('request');

const http = opts => new Promise((resolve, reject) => request(opts, (err, { statusCode }, body) =>
  (err || statusCode >= 400 ?
    reject({ status: statusCode, errors: (err ? [err] : body.errors) }) :
    resolve(body))));


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
