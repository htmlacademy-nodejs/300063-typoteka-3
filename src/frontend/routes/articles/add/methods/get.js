'use strict';

const {categoryAdapter, dateAdapter} = require(`../../../../adapters`);
const {logger} = require(`../../../../utils`);


module.exports = async (req, res) => {
  let {account, errorMessages, article} = req.locals;
  const categories = await categoryAdapter.getList();
  if (!article) {
    article = {
      date: dateAdapter.get(new Date().toISOString()).day,
    };
  }
  const content = {
    type: `add`,
    article,
    account,
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
