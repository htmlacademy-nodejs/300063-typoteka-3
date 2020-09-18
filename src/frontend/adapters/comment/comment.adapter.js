'use strict';

const request = require(`../request`);
const {dateAdapter} = require(`../date`);


class CommentAdapter {
  async getList(queryParams) {
    const comments = await request.get(`comments`, queryParams);
    return this._adaptComment(comments);
  }

  async getListByArticleId(articleId) {
    const comments = await request.get(`articles/${articleId}/comments`);
    return this._adaptComment(comments);
  }

  addItem(params) {
    const {articleId, text} = params;
    return request.post(`articles/${articleId}/comments`, {text});
  }

  _adaptComment(comments) {
    return comments.map((comment) => ({
      ...comment,
      date: dateAdapter.get(comment.date),
    }));
  }
}

module.exports = new CommentAdapter();
