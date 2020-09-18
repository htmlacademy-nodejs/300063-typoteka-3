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

  get(path, queryParams) {
    const url = this._getUrl(path, queryParams);
    return axios.get(url)
      .then((res) => res.data)
      .catch(this._getErrorStatus);
  }

  post(path, body, queryParams) {
    const url = this._getUrl(path, queryParams);
    return axios.post(url, body)
      .then((res) => res.data)
      .catch(this._getErrorStatus);
  }

  put(path, body, queryParams) {
    const url = this._getUrl(path, queryParams);
    return axios.put(url, body)
      .then((res) => res.data)
      .catch(this._getErrorStatus);
  }

  delete(path, queryParams) {
    const url = this._getUrl(path, queryParams);
    return axios.delete(url)
      .then((res) => res.data)
      .catch(this._getErrorStatus);
  }

  _getErrorStatus(error) {
    return {
      status: `failed`,
      statusCode: error.response.status,
      content: error.response.data,
    };
  }

  _getUrl(path, queryParams) {
    const query = this._getQueryString(queryParams);
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
    return `?${queries.join(`&`)}`;
  }
}

module.exports = new Request();
