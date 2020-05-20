'use strict';

const {nanoid} = require(`nanoid`);

const {articleAdapter} = require(`../article`);


class CommentAdapter {
  constructor() {
  }

  getList(articleId) {
    const article = articleAdapter.getItemById(articleId);
    return article ? article.comments : null;
  }

  addItemById(articleId, params) {
    const commentList = this.getList(articleId);
    if (commentList === null) {
      return null;
    }
    const comment = {
      id: nanoid(),
      ...params,
    };
    commentList.push(comment);
    return comment;
  }
}

module.exports = new CommentAdapter();
