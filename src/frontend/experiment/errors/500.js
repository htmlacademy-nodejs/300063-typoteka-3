'use strict';

const HttpCodes = require(`http-status-codes`);


class InternalServerErrorRoute {
  async get(req, res) {
    res.status(HttpCodes.NOT_FOUND).render(`pages/errors/500`);
  }
}

module.exports = InternalServerErrorRoute;
