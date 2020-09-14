'use strict';

const newArticleSchema = require(`./new-article`);
const newComment = require(`./new-comment`);
const updatedArticleSchema = require(`./updated-article`);


module.exports = {
  newArticleSchema,
  newComment,
  updatedArticleSchema,
};
