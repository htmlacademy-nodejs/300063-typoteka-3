'use strict';

const request = require(`../request`);
const {adaptDate} = require(`../../utils`);


class CommentAdapter {
  async getList(params) {
    const res = await request.get(`comments`, params);
    return this._adaptComment(res.data);
  }

  async addItem(commentBody, params) {
    const res = await request.post(`comments`, commentBody, params);
    return res.data;
  }

  async deleteItem(commentId, params) {
    const res = await request.delete(`comments/${commentId}`, params);
    return res.data;
  }

  _adaptComment(comments) {
    return comments.map((comment) => ({
      ...comment,
      date: adaptDate(comment.date),
    }));
  }
}

module.exports = new CommentAdapter();
