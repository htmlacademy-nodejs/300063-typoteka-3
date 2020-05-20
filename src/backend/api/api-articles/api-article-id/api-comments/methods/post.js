'use strict';

const HttpCodes = require(`http-status-codes`);

const {commentAdapter} = require(`backend/adapters`);


module.exports = async (req, res) => {
  const comment = commentAdapter.addItemById(req.params.articleId, req.body);
  res.status(HttpCodes.CREATED).send(comment);
};
