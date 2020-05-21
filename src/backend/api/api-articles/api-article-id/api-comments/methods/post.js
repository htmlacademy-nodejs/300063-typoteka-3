'use strict';

const HttpCodes = require(`http-status-codes`);

const {commentValidator, commentAdapter} = require(`backend/adapters`);
const {logger} = require(`backend/utils`);


module.exports = async (req, res) => {
  const validator = commentValidator.checkRequestField(req);
  if (validator.extra.length !== 0 || validator.required.length !== 0) {
    res.status(HttpCodes.BAD_REQUEST).send(validator);
    logger.endRequest(req, res);
  } else {
    const comment = commentAdapter.addItemById(req.params.articleId, req.body);
    res.status(HttpCodes.CREATED).send(comment);
    logger.endRequest(req, res);
  }
};
