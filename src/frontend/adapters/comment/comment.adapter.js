'use strict';

const request = require(`../request`);
const {dateAdapter} = require(`../date`);


class CommentAdapter {
  async getList(params) {
    const res = await request.get(`comments`, params);
    return this._adaptComment(res.data);
  }

  async getListByArticleId(articleId) {
    const res = await request.get(`articles/${articleId}/`);
    return this._adaptComment(res.data);
  }

  async addItem(params) {
    const {text, articleId, accountId} = params;
    const res = await request.post(`comments`, {
      text,
      accountId,
      articleId,
    });
    return res.data;
  }

  async deleteItem(commentId) {
    const res = await request.delete(`comments/${commentId}`);
    return res.data;
  }

  _adaptComment(comments) {
    return comments.map((comment) => ({
      ...comment,
      date: dateAdapter.get(comment.date),
    }));
  }
}

module.exports = new CommentAdapter();
