'use strict';

const {accountAdapter, articleAdapter, categoryAdapter} = require(`../../../../adapters`);
const {logger} = require(`../../../../utils`);


module.exports = async (req, res) => {
  let {article, errorMessages} = req.locals || {};
  const articleRes = await articleAdapter.getItemById(req.params.articleId);
  if (articleRes.content && articleRes.content.errorMessages) {
    res.status(article.statusCode).send();
    return;
  }
  const categories = await categoryAdapter.getList();
  if (!article) {
    article = articleRes;
    article.date = article.date.day;
    article.categories = categories.reduce((acc, category) => {
      if (article.categories.includes(category.title)) {
        acc.push(category.id);
      }
      return acc;
    }, []);
  }

  const content = {
    type: `edit`,
    article,
    account: accountAdapter.getAuth(),
    categories,
    scriptList: [
      `js/vendor.js`,
      `js/main.js`
    ],
    errorMessages,
  };
  res.render(`pages/articles/edit`, content);
  logger.endRequest(req, res);
};
