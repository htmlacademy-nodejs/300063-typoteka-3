'use strict';

const HttpCodes = require(`http-status-codes`);
const {logger} = require(`frontend/utils`);
const {accountAdapter, articleAdapter} = require(`frontend/adapters`);


module.exports = async (req, res) => {
  let article = await articleAdapter.getItemById(req.params.id);
  if (article.statusCode >= HttpCodes.BAD_REQUEST) {
    res.status(article.statusCode).send();
    return;
  }
  if (Object.keys(req.body).length > 0) {
    article = {
      ...article,
      ...req.body,
    };
  }

  const content = {
    type: `edit`,
    article,
    account: accountAdapter.getAuth(),
    scriptList: [
      `js/vendor.js`,
      `js/main.js`
    ],
  };
  res.render(`pages/articles/edit`, content);
  logger.endRequest(req, res);
};
