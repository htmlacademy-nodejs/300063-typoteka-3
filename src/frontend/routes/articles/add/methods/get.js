'use strict';

const {logger, transformDate} = require(`frontend/utils`);
const {accountAdapter, categoryAdapter, dateAdapter} = require(`frontend/adapters`);

const getArticle = (article) => {
  const date = article.createdDate ? transformDate(article.createdDate) : new Date();
  return {
    ...article,
    createdDate: dateAdapter.get(date),
  };
};

module.exports = async (req, res) => {
  const categoryList = await categoryAdapter.getList();
  const content = {
    type: `add`,
    article: getArticle(req.body),
    account: accountAdapter.getAuth(),
    categoryList,
    scriptList: [
      `js/vendor.js`,
      `js/main.js`
    ],
  };
  res.render(`pages/articles/edit`, content);
  logger.endRequest(req, res);
};
