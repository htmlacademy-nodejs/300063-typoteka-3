'use strict';

const HttpCodes = require(`http-status-codes`);


class InternalServerErrorRoute {
  async get(req, res) {
    const {account} = req.locals;
    res.status(HttpCodes.NOT_FOUND).render(`pages/errors/500`, {account});
  }
}

module.exports = InternalServerErrorRoute;
