'use strict';

const HttpCodes = require(`http-status-codes`);


class CheckServerRoute {
  constructor() {
    this.get = this.get.bind(this);
  }

  async get(req, res) {
    res.sendStatus(HttpCodes.OK);
  }
}

module.exports = CheckServerRoute;
