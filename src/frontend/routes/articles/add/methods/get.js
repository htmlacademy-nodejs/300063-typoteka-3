'use strict';

const {accountAdapter, categoryAdapter, dateAdapter} = require(`../../../../adapters`);
const {logger} = require(`../../../../utils`);


module.exports = async (req, res) => {
  const categories = await categoryAdapter.getList();
  const content = {
    type: `add`,
    article: req.locals ? {
      ...req.locals.article,
      categories: req.locals.article.categories.map((category) => +category)
    } : {
      date: dateAdapter.get(new Date().toISOString()).day,
    },
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
