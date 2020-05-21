'use strict';

const HttpCodes = require(`http-status-codes`);

const {commentAdapter} = require(`backend/adapters`);
const {logger} = require(`backend/utils`);


module.exports = async (req, res) => {
  const commentList = commentAdapter.getList(req.params.articleId);
  if (commentList === null) {
    res.status(HttpCodes.BAD_REQUEST).send({message: `Article with ${req.params.articleId} id isn't exist`});
    logger.endRequest(req, res);
  } else {
    res.status(HttpCodes.OK).send(commentList);
    logger.endRequest(req, res);
  }
};
