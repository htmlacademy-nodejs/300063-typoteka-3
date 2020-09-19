'use strict';

const HttpCodes = require(`http-status-codes`);

const {db} = require(`../../../db`);
const {logger} = require(`../../../utils`);


const deleteComment = async (req) => {
  const {commentId} = req.params;
  return await db.Comment.destroy({
    where: {
      id: commentId,
    }
  });
};

module.exports = async (req, res) => {
  const result = await deleteComment(req);
  const httpCode = result ? HttpCodes.NO_CONTENT : HttpCodes.BAD_REQUEST;
  res.status(httpCode).send();
  logger.endRequest(req, res);
};
