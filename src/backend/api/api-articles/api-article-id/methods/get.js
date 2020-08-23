'use strict';

const HttpCodes = require(`http-status-codes`);

const {articleAdapter} = require(`../../../../adapters`);
const {logger} = require(`../../../../utils`);


module.exports = async (req, res) => {
  const article = articleAdapter.getItemById(req.params.articleId);
  if (article === null) {
    res.status(HttpCodes.NOT_FOUND).send();
    logger.endRequest(req, res);
  } else {
    res.status(HttpCodes.OK).send(article);
    logger.endRequest(req, res);
  }
};
