'use strict';

const axios = require(`axios`);

const {commonParams} = require(`../../common/params`);
const {getQueryString} = require(`../utils`);


class Request {
  constructor() {
    const protocol = process.env.PROTOCOL || commonParams.DEFAULT_PROTOCOL;
    const domain = process.env.DOMAIN || commonParams.DEFAULT_DOMAIN;
    const port = parseInt(process.env.BACKED_PORT, 10) || commonParams.DEFAULT_BACKEND_PORT;
    this._url = `${protocol}://${domain}:${port}/api`;
  }

  get(path, params = {}) {
    const {query, headers} = params;
    const url = this._getUrl(path, query);
    return axios.get(url, {headers})
      .catch(this._getErrorStatus);
  }

  post(path, body, params = {}) {
    const {query, headers} = params;
    const url = this._getUrl(path, query);
    return axios.post(url, body, {headers})
      .catch(this._getErrorStatus);
  }

  put(path, body, params = {}) {
    const {query, headers} = params;
    const url = this._getUrl(path, query);
    return axios.put(url, body, {headers})
      .catch(this._getErrorStatus);
  }

  delete(path, params = {}) {
    const {query, headers} = params;
    const url = this._getUrl(path, query);
    return axios.delete(url, {headers})
      .catch(this._getErrorStatus);
  }

  _getErrorStatus(error) {
    return {
      data: {
        status: `failed`,
        statusCode: error.response.status,
        content: error.response.data,
      }
    };
  }

  _getUrl(path, queryParams) {
    const queryString = getQueryString(queryParams);
    const query = queryString && `?${queryString}`;
    return `${this._url}/${path}${query}`;
  }
}

module.exports = new Request();
