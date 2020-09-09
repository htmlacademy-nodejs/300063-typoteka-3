'use strict';

const {logger} = require(`../../../utils`);
const {articleAdapter, accountAdapter, commentAdapter} = require(`../../../adapters`);


module.exports = async (req, res) => {
  const article = await articleAdapter.getItemById(req.params.articleId);
  const comments = await commentAdapter.getListByArticleId(req.params.articleId);
  const content = {
    isPost: true,
    article,
    account: accountAdapter.getAuth(),
    scriptList: [`js/main.js`],
    comments: {
      hasUserError: false,
      list: comments,
    },
  };
  res.render(`pages/articles/article`, content);
  logger.endRequest(req, res);
};
