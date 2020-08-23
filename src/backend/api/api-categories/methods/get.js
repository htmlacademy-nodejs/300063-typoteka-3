'use strict';

const HttpCodes = require(`http-status-codes`);

const {categoryAdapter} = require(`../../../adapters`);
const {logger} = require(`../../../utils`);


module.exports = async (req, res) => {
  res.status(HttpCodes.OK).send(categoryAdapter.getList());
  logger.endRequest(req, res);
};
