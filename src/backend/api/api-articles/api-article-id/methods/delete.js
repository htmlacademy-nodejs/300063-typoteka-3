'use strict';

const HttpCodes = require(`http-status-codes`);

const {articleAdapter} = require(`backend/adapters`);


module.exports = async (req, res) => {
  const result = articleAdapter.removeItemById(req.params.articleId);
  if (result === null) {
    res.status(HttpCodes.BAD_REQUEST).send({message: `Article with ${req.params.articleId} id isn't exist`});
  } else {
    res.status(HttpCodes.NO_CONTENT).send(result);
  }

};
