'use strict';

const HttpCodes = require(`http-status-codes`);

const {categoryAdapter} = require(`../../../../adapters`);
const {logger} = require(`../../../../utils`);


const saveCategory = async (req, res) => {
  const {categoryId} = req.params;
  const {title} = req.body;
  const categoryParams = {
    id: +categoryId,
    title,
  };
  const updatedCategoryRes = await categoryAdapter.updateItem(categoryParams);

  let path = `/categories`;
  if (updatedCategoryRes.content && updatedCategoryRes.content.errorMessages) {
    const queryParams = {
      updatedCategory: categoryParams,
      errorMessages: updatedCategoryRes.content.errorMessages,
    };
    const query = encodeURIComponent(JSON.stringify(queryParams));
    path = `/categories?params=${query}`;
  }
  res.redirect(path);
};

const deleteCategory = async (req, res) => {
  const {categoryId} = req.params;
  await categoryAdapter.deleteItem(categoryId);
  res.redirect(`/categories`);
};

const actionMap = new Map([
  [`save`, saveCategory],
  [`delete`, deleteCategory],
]);

module.exports = async (req, res) => {
  const action = actionMap.get(req.body.action);
  if (!action) {
    res.status(HttpCodes.BAD_REQUEST);
  } else {
    action(req, res);
  }
  logger.endRequest(req, res);
};
