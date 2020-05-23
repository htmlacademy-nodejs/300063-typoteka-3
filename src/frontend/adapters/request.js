'use strict';

const axios = require(`axios`);
const {params} = require(`common`);


class Request {
  constructor() {
    const protocol = process.env.PROTOCOL || params.DEFAULT_PROTOCOL;
    const domain = process.env.DOMAIN || params.DEFAULT_DOMAIN;
    const port = parseInt(process.env.BACKED_PORT, 10) || params.DEFAULT_BACKEND_PORT;
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

  async post(path, body) {
    return await axios.post(`${this._url}/${path}`, body)
      .then((res) => res.data)
      .catch(this._getErrorStatus);
  }

  async put(path, body) {
    return await axios.put(`${this._url}/${path}`, body)
      .then((res) => res.data)
      .catch(this._getErrorStatus);
  }
}

module.exports = new Request();
