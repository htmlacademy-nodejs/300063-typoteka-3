'use strict';

const {categoryAdapter} = require(`../../../adapters`);
const {logger} = require(`../../../utils`);


module.exports = async (req, res) => {
  const {title} = req.body;
  const categoryParams = {title};
  const createdCategoryRes = await categoryAdapter.addItem(categoryParams);
  let path = `/categories`;
  if (createdCategoryRes.content && createdCategoryRes.content.errorMessages) {
    const queryParams = {
      createdCategory: categoryParams,
      errorMessages: createdCategoryRes.content.errorMessages,
    };
    const query = encodeURIComponent(JSON.stringify(queryParams));
    path = `/categories?params=${query}`;
  }
  res.redirect(path);
  logger.endRequest(req, res);
};
