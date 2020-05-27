'use strict';

const HttpCodes = require(`http-status-codes`);

const {articleAdapter} = require(`backend/adapters`);


module.exports = async (req, res) => {
  const article = articleAdapter.getItemById(req.params.articleId);
  if (article === null) {
    res.status(HttpCodes.NOT_FOUND).send();
  } else {
    res.status(HttpCodes.OK).send(article);
  }
};
