'use strict';

const HttpCodes = require(`http-status-codes`);

const {logger} = require(`../utils`);


module.exports = (req, res) => {
  res.status(HttpCodes.NOT_FOUND).send(`Not found`);
  logger.endRequest(req, res);
};
