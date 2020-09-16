'use strict';

const newArticleSchema = require(`./new-article`);
const newCategorySchema = require(`./new-category`);
const newComment = require(`./new-comment`);
const updatedArticleSchema = require(`./updated-article`);


module.exports = {
  newArticleSchema,
  newCategorySchema,
  newComment,
  updatedArticleSchema,
};
