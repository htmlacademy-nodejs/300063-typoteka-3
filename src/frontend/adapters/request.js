'use strict';

const axios = require(`axios`);

const {DEFAULT_PROTOCOL, DEFAULT_DOMAIN, DEFAULT_BACKEND_PORT} = require(`../../common/params`);


class Request {
  constructor() {
    const protocol = process.env.PROTOCOL || DEFAULT_PROTOCOL;
    const domain = process.env.DOMAIN || DEFAULT_DOMAIN;
    const port = parseInt(process.env.BACKED_PORT, 10) || DEFAULT_BACKEND_PORT;
    this._url = `${protocol}://${domain}:${port}/api`;
  }

  get(path, params = {}) {
    const {query} = params;
    const url = this._getUrl(path, query);
    return axios.get(url)
      .catch(this._getErrorStatus);
  }

  post(path, body, params = {}) {
    const {query, headers} = params;
    const url = this._getUrl(path, query);
    return axios({
      method: `POST`,
      url,
      data: body,
      headers,
    })
      .catch(this._getErrorStatus);
  }

  put(path, body, params = {}) {
    const {query} = params;
    const url = this._getUrl(path, query);
    return axios.put(url, body)
      .catch(this._getErrorStatus);
  }

  delete(path, params = {}) {
    const {query} = params;
    const url = this._getUrl(path, query);
    return axios.delete(url)
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
    const queryString = this._getQueryString(queryParams);
    const query = queryString && `?${queryString}`;
    return `${this._url}/${path}${query}`;
  }

  _getQueryString(queryParams) {
    if (!queryParams) {
      return ``;
    }
    const keys = Object.keys(queryParams);
    if (keys.length === 0) {
      return ``;
    }
    const queries = keys.reduce((acc, key) => {
      return queryParams[key]
        ? acc.concat(`${key}=${queryParams[key]}`)
        : acc;
    }, []);
    return `${queries.join(`&`)}`;
  }
}

module.exports = new Request();
