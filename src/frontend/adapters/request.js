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

  _getErrorStatus(error) {
    return {
      status: `failed`,
      statusCode: error.response.status,
      content: error.response.data,
    };
  }

  get(path) {
    return axios.get(`${this._url}/${path}`)
      .then((res) => res.data)
      .catch(this._getErrorStatus);
  }

  post(path, body) {
    return axios.post(`${this._url}/${path}`, body)
      .then((res) => res.data)
      .catch(this._getErrorStatus);
  }

  put(path, body) {
    return axios.put(`${this._url}/${path}`, body)
      .then((res) => res.data)
      .catch(this._getErrorStatus);
  }

  delete(path) {
    return axios.delete(`${this._url}/${path}`)
      .then((res) => res.data)
      .catch(this._getErrorStatus);
  }
}

module.exports = new Request();
