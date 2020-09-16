'use strict';

const HttpCodes = require(`http-status-codes`);

const {categoryAdapter} = require(`../../../../adapters`);
const {logger} = require(`../../../../utils`);


const saveCategory = async (req, res) => {
  const {categoryId} = req.params;
  const {title} = req.body;
  const updatedCategoryRes = await categoryAdapter.updateItem({
    id: categoryId,
    title,
  });
  if (updatedCategoryRes.content && updatedCategoryRes.content.errorMessages) {
    //
    // @TODO сохранять состояние через сессии или JWT
    //
    // req.locals = {
    //   errorMessages: {
    //     [categoryId]: updatedCategoryRes.content.errorMessages
    //   }
    // };
    res.redirect(`/categories`);
  }
};

const deleteCategory = async (req, res) => {
  const {categoryId} = req.params;
  await categoryAdapter.deleteItem(categoryId);
  //
  // @TODO добавить обработку ошибок
  //
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
  // res.status(HttpCodes.OK).send(categoryId);
  logger.endRequest(req, res);
};
