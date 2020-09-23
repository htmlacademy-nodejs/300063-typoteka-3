'use strict';

const request = require(`../request`);
const {dateAdapter} = require(`../date`);


class CommentAdapter {
  async getList(params) {
    const comments = await request.get(`comments`, params);
    return this._adaptComment(comments);
  }

  async getListByArticleId(articleId) {
    const comments = await request.get(`articles/${articleId}/comments`);
    return this._adaptComment(comments);
  }

  async addItem(params) {
    const {articleId, text} = params;
    return await request.post(`articles/${articleId}/comments`, {text});
  }

  async deleteItem(commentId) {
    return await request.delete(`comments/${commentId}`);
  }

  _adaptComment(comments) {
    return comments.map((comment) => ({
      ...comment,
      date: dateAdapter.get(comment.date),
    }));
  }
}

module.exports = new CommentAdapter();
