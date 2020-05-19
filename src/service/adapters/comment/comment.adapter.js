'use strict';

const {articleAdapter} = require(`../article`);


class CommentAdapter {
  constructor() {
  }

  getList(articleId) {
    const article = articleAdapter.getItemById(articleId);
    return article ? article.comments : null;
  }
}

module.exports = new CommentAdapter();
