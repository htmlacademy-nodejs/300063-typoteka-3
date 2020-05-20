'use strict';

const HttpCodes = require(`http-status-codes`);

const {commentAdapter} = require(`backend/adapters`);


module.exports = async (req, res) => {
  const commentList = commentAdapter.getList(req.params.articleId);
  if (commentList === null) {
    res.status(HttpCodes.BAD_REQUEST).send({message: `Article with ${req.params.articleId} id isn't exist`});
  } else {
    res.status(HttpCodes.OK).send(commentList);
  }
};
