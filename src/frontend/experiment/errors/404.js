'use strict';

const HttpCodes = require(`http-status-codes`);


class NotFoundRoute {
  async get(req, res) {
    res.status(HttpCodes.NOT_FOUND).render(`pages/errors/404`);
  }
}

module.exports = NotFoundRoute;
