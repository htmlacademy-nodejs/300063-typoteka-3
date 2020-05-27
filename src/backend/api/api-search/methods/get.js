'use strict';

const HttpCodes = require(`http-status-codes`);

const {articleAdapter} = require(`backend/adapters`);


module.exports = async (req, res) => {
  const articleList = articleAdapter.searchByTitle(req.query.title);
  if (articleList.length === 0) {
    res.status(HttpCodes.NOT_FOUND).send();
  } else {
    res.status(HttpCodes.OK).send(articleList);
  }
};
