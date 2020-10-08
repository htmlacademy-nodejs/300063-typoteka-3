'use strict';

const {frontendParams} = require(`../../../common/params`);
const {commentAdapter} = require(`../../adapters`);
const {appSocket} = require(`../socket`);
const EntityName = require(`../entity-name`);


const CommentSocketEvent = {
  HOT_ARTICLES: `hot-articles`,
  LAST_COMMENTS: `last-comments`,
};

class Comment {
  constructor() {
    this.update = this.update.bind(this);
  }

  async update(req, res, socket) {
    const lastComments = await this._getLastComments();
    socket.emit(CommentSocketEvent.LAST_COMMENTS, lastComments);
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

module.exports = () => {
  appSocket.add(EntityName.COMMENTS, Comment);
};
