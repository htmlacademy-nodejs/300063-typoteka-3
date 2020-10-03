'use strict';

const HttpCodes = require(`http-status-codes`);


class NotFoundRoute {
  async get(req, res) {
    const {account} = req.locals;
    res.status(HttpCodes.NOT_FOUND).render(`pages/errors/404`, {account});
  }
}

module.exports = NotFoundRoute;
