'use strict';

const axios = require(`axios`);
const {DEFAULT_PROTOCOL, DEFAULT_BACKEND_PORT, DEFAULT_DOMAIN} = require(`common`);


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

  async get(path) {
    return await axios.get(`${this._url}/${path}`)
      .then((res) => res.data)
      .catch(this._getErrorStatus);
  }

  async post(path, params) {
    return await axios.post(`${this._url}/${path}`, params)
      .then((res) => res.data)
      .catch(this._getErrorStatus);
  }

  async put(path, params) {
    return await axios.put(`${this._url}/${path}`, params)
      .then((res) => res.data)
      .catch(this._getErrorStatus);
  }
}

module.exports = new Request();
