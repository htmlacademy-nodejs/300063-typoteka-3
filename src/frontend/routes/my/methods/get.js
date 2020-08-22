'use strict';

const {logger} = require(`frontend/utils`);
const {articleAdapter} = require(`frontend/adapters`);

module.exports = async (req, res) => {
  const articleList = await articleAdapter.getList();
  const content = {
    articleList
  };
  res.render(`pages/my/my`, content);
  logger.endRequest(req, res);
};
