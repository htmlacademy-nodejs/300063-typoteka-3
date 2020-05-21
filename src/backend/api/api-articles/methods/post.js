'use strict';

const HttpCodes = require(`http-status-codes`);

const {articleAdapter, articleValidator} = require(`backend/adapters`);
const {logger} = require(`backend/utils`);


module.exports = async (req, res) => {
  const validator = articleValidator.checkRequestField(req);
  if (validator.extra.length !== 0 || validator.required.length !== 0) {
    res.status(HttpCodes.BAD_REQUEST).send(validator);
    logger.endRequest(req, res);
  } else {
    const article = await articleAdapter.addItem(req.body);
    res.status(HttpCodes.CREATED).send(article);
    logger.endRequest(req, res);
  }
};