'use strict';

const HttpCodes = require(`http-status-codes`);

const {categoryAdapter} = require(`backend/adapters`);
const {logger} = require(`backend/utils`);


module.exports = async (req, res) => {
  res.status(HttpCodes.OK).send(categoryAdapter.getList());
  logger.endRequest(req, res);
};
