'use strict';

const {articleAdapter, articleValidator, articleParams} = require(`./article`);
const {commentAdapter, commentValidator, commentParams} = require(`./comment`);
const {categoryAdapter} = require(`./category`);


module.exports = {
  articleAdapter,
  articleValidator,
  articleParams,
  commentAdapter,
  commentValidator,
  commentParams,
  categoryAdapter,
};
