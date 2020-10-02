'use strict';

const loginSchema = require(`./login`);
const newArticleSchema = require(`./new-article`);
const newCategorySchema = require(`./new-category`);
const newComment = require(`./new-comment`);
const newUser = require(`./new-user`);
const tokenSchema = require(`./token`);
const updatedArticleSchema = require(`./updated-article`);


module.exports = {
  loginSchema,
  newArticleSchema,
  newCategorySchema,
  newComment,
  newUser,
  tokenSchema,
  updatedArticleSchema,
};
