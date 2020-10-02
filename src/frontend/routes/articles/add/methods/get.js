'use strict';

const {accountAdapter, categoryAdapter, dateAdapter} = require(`../../../../adapters`);
const {logger} = require(`../../../../utils`);


module.exports = async (req, res) => {
  const categories = await categoryAdapter.getList();
  let {article, errorMessages} = req.locals || {};
  if (!article) {
    article = {
      date: dateAdapter.get(new Date().toISOString()).day,
    };
  }
  const content = {
    type: `add`,
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
