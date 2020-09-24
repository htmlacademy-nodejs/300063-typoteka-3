'use strict';

const {categoryAdapter} = require(`../../../adapters`);
const {logger} = require(`../../../utils`);


module.exports = async (req, res) => {
  const {account} = req.locals;
  const categories = await categoryAdapter.getList();
  const {createdCategory, updatedCategory, errorMessages} = req.locals || {};
  const content = {
    account,
    categories,
    createdCategory,
    updatedCategory,
    errorMessages,
  };
  res.render(`pages/categories`, content);
  logger.endRequest(req, res);
};
