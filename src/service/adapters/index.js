'use strict';

const {articleAdapter, articleValidator} = require(`./article`);
const {commentAdapter, commentValidator} = require(`./comment`);
const {categoryAdapter} = require(`./category`);


module.exports = {
  articleAdapter,
  articleValidator,
  commentAdapter,
  commentValidator,
  categoryAdapter,
};
