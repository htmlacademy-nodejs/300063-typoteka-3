'use strict';

const {logger} = require(`../../../utils`);
const {articleAdapter, accountAdapter, commentAdapter} = require(`../../../adapters`);


module.exports = async (req, res) => {
  const {articleId} = req.params;
  const article = await articleAdapter.getItemById(articleId);
  const comments = await commentAdapter.getListByArticleId(articleId);
  const {errorMessages, comment: newComment} = req.locals && req.locals || {};
  const content = {
    isPost: true,
    article,
    account: accountAdapter.getAuth(),
    scriptList: [`js/main.js`],
    comments,
    errorMessages,
    newComment,
  };
  res.render(`pages/articles/article`, content);
  logger.endRequest(req, res);
};
