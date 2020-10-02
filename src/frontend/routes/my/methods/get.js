'use strict';

const {logger} = require(`../../../utils`);
const {articleAdapter} = require(`../../../adapters`);


module.exports = async (req, res) => {
  const articles = await articleAdapter.getList();
  const content = {
    articleList: articles.list,
  };
  res.render(`pages/my/my`, content);
  logger.endRequest(req, res);
};
