'use strict';

const {logger} = require(`../../../utils`);
const {articleAdapter, commentAdapter} = require(`../../../adapters`);


module.exports = async (req, res) => {
  const {account, errorMessages, comment: newComment} = req.locals;
  const {articleId} = req.params;
  const article = await articleAdapter.getItemById(articleId);
  const comments = await commentAdapter.getListByArticleId(articleId);
  const content = {
    isPost: true,
    article,
    account,
    scriptList: [`js/main.js`],
    comments,
    errorMessages,
    newComment,
  };
  res.render(`pages/articles/article`, content);
  logger.endRequest(req, res);
};
