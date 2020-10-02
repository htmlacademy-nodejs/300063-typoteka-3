'use strict';

const {accountAdapter, categoryAdapter} = require(`../../../adapters`);
const {logger} = require(`../../../utils`);


module.exports = async (req, res) => {
  const categories = await categoryAdapter.getList();
  const {createdCategory, updatedCategory, errorMessages} = req.locals || {};
  const content = {
    account: accountAdapter.getAuth(),
    categories,
    createdCategory,
    updatedCategory,
    errorMessages,
  };
  res.render(`pages/categories`, content);
  logger.endRequest(req, res);
};
