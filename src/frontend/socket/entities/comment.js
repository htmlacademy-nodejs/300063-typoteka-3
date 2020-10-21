'use strict';

const {frontendParams} = require(`../../../common/params`);
const {commentAdapter} = require(`../../adapters`);


const CommentSocketEvent = {
  CREATE_COMMENT: `create-comment`,
  DELETE_COMMENT: `delete-comment`,
  LAST_COMMENTS: `last-comments`,
};

class CommentSocket {
  constructor(io) {
    this._io = io;
    this.create = this.create.bind(this);
  }

  async create(req, params) {
    const {data} = params;
    this._io.emit(CommentSocketEvent.CREATE_COMMENT, data);
  }

  async update() {
    const lastComments = await this._getLastComments();
    this._io.emit(CommentSocketEvent.LAST_COMMENTS, lastComments);
  }

  async delete(req, params) {
    const {data} = params;
    this._io.emit(CommentSocketEvent.DELETE_COMMENT, data);
  }

  async _getLastComments() {
    const commentsRes = await commentAdapter.getList({
      query: {
        limit: frontendParams.LAST_COMMENT_COUNT,
      },
    });
    return commentsRes.map((comment) => ({
      ...comment,
      text: comment.text.length > frontendParams.LAST_COMMENT_LETTERS
        ? `${comment.text.slice(0, frontendParams.LAST_COMMENT_LETTERS)}...`
        : comment.text,
    }));
  }
}

module.exports = CommentSocket;
