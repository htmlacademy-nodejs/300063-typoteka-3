'use strict';

const request = require(`../request`);
const {adaptDate} = require(`../../utils`);


class CommentAdapter {
  async getList(params) {
    const commentRes = await request.get(`comments`, params);
    return commentRes.data.map((comment) => this._adaptComment(comment));
  }

  async getItemById(commentId, params) {
    const commentRes = await request.get(`comments/${commentId}`, params);
    return this._adaptComment(commentRes.data);
  }

  async addItem(commentBody, params) {
    const res = await request.post(`comments`, commentBody, params);
    return this._adaptComment(res.data);
  }

  async deleteItem(commentId, params) {
    const res = await request.delete(`comments/${commentId}`, params);
    return res.data;
  }

  _adaptComment(comment) {
    return {
      ...comment,
      date: adaptDate(comment.date),
    };
  }
}

module.exports = new CommentAdapter();
