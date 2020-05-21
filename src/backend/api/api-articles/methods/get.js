'use strict';

const HttpCodes = require(`http-status-codes`);

const {articleAdapter} = require(`backend/adapters`);
const {logger} = require(`backend/utils`);


module.exports = async (req, res) => {
  const articleList = articleAdapter.getList();
  res.status(HttpCodes.OK).send(articleList);
  logger.endRequest(req, res);
};
