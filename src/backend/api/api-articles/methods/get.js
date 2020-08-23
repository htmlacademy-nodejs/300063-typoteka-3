'use strict';

const HttpCodes = require(`http-status-codes`);

const {articleAdapter} = require(`../../../adapters`);
const {logger} = require(`../../../utils`);


module.exports = async (req, res) => {
  const articleList = articleAdapter.getList();
  res.status(HttpCodes.OK).send(articleList);
  logger.endRequest(req, res);
};
