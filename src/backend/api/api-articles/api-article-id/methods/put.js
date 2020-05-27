'use strict';

const HttpCodes = require(`http-status-codes`);

const {articleAdapter} = require(`backend/adapters`);

module.exports = async (req, res) => {
  const article = articleAdapter.updateItemById(req.params.articleId, req.body);
  if (article === null) {
    res.status(HttpCodes.BAD_REQUEST).send({message: `Article with ${req.params.articleId} id isn't exist`});
  } else {
    res.status(HttpCodes.OK).send(article);
  }
};
