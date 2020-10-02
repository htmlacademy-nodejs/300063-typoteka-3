'use strict';

const getCategories = require(`./get`);
const postCategory = require(`./post`);
const putCategory = require(`./put`);
const deleteCategory = require(`./delete`);


module.exports = {
  getCategories,
  postCategory,
  putCategory,
  deleteCategory,
};
