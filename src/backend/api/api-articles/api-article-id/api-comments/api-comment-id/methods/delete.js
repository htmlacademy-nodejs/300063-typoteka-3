'use strict';

const HttpCodes = require(`http-status-codes`);

const {commentAdapter} = require(`backend/adapters`);
const {logger} = require(`backend/utils`);


const commentResponseMap = new Map([
  [`article`, (res, req, result) => {
    result.error.message = `Article with ${req.params.articleId} id isn't exist`;
    res.status(HttpCodes.BAD_REQUEST).send(result);
  }],
  [`comment`, (res, req, result) => {
    result.error.message = `Comment with ${req.params.commentId} id isn't exist`;
    res.status(HttpCodes.BAD_REQUEST).send(result);
  }],
]);

module.exports = async (req, res) => {
  const result = commentAdapter.removeItemById(req.params.articleId, req.params.commentId);
  if (result.error) {
    commentResponseMap.get(result.error.entity)(res, req, result);
    logger.endRequest(req, res);
  } else {
    res.status(HttpCodes.NO_CONTENT).send(result);
    logger.endRequest(req, res);
  }
};
