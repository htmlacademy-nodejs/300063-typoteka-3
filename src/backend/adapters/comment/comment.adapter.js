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

  removeItemById(articleId, commentId) {
    const article = articleAdapter.getItemById(articleId);
    if (article === null) {
      return this._getError(`article`);
    }
    const commentIndex = article.comments.findIndex((item) => item.id === commentId);
    if (commentIndex === -1) {
      return this._getError(`comment`);
    }
    article.comments.splice(commentIndex, 1);
    return {};
  }

  _getError(entity) {
    return {
      error: {entity},
    };
  }
}

module.exports = new CommentAdapter();
