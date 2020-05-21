'use strict';

const HttpCodes = require(`http-status-codes`);

const {articleAdapter} = require(`backend/adapters`);
const {logger} = require(`backend/utils`);


module.exports = async (req, res) => {
  const articleList = articleAdapter.searchByTitle(req.query.title);
  if (articleList.length === 0) {
    res.status(HttpCodes.NOT_FOUND).send();
    logger.endRequest(req, res);
  } else {
    res.status(HttpCodes.OK).send(articleList);
    logger.endRequest(req, res);
  }
};
