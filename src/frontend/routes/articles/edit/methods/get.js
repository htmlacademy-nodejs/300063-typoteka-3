'use strict';

const HttpCodes = require(`http-status-codes`);

const {accountAdapter, articleAdapter, categoryAdapter} = require(`../../../../adapters`);
const {logger} = require(`../../../../utils`);


module.exports = async (req, res) => {
  const categories = await categoryAdapter.getList();
  let article = await articleAdapter.getItemById(req.params.articleId);
  if (article.statusCode >= HttpCodes.BAD_REQUEST) {
    res.status(article.statusCode).send();
    return;
  }
  article.date = article.date.day;
  article.categories = categories.reduce((acc, category) => {
    if (article.categories.includes(category.title)) {
      acc.push(category.id);
    }
    return acc;
  }, []);
  article = req.locals && req.locals.article || article;

  const content = {
    type: `edit`,
    article: req.locals && req.locals.article || article,
    account: accountAdapter.getAuth(),
    categories,
    scriptList: [
      `js/vendor.js`,
      `js/main.js`
    ],
    errorMessages: req.locals && req.locals.errorMessages,
  };
  res.render(`pages/articles/edit`, content);
  logger.endRequest(req, res);
};
