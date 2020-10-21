'use strict';

const {commentAdapter} = require(`../../adapters`);
const routeName = require(`../../route-name`);
const {appSocket, EntityName} = require(`../../socket`);
const {logger} = require(`../../utils`);


class CommentRoute {
  constructor() {
    this.post = this.post.bind(this);
  }

  async post(req, res) {
    const {commentId} = req.params;
    const {cookie} = req.headers;
    const comment = await commentAdapter.getItemById(commentId);
    const deletedCommentRes = await commentAdapter.deleteItem(commentId, {
      headers: {cookie},
    });
    if (!deletedCommentRes.content || !deletedCommentRes.content.errorMessages) {
      appSocket.delete(req, {
        name: EntityName.COMMENTS,
        data: {commentId},
      });
      appSocket.update(req, {name: EntityName.COMMENTS});
      appSocket.update(req, {
        name: EntityName.ARTICLES,
        data: {
          articleId: comment.article.id,
        }
      });
    }
    res.redirect(`/${routeName.MY}/${routeName.COMMENTS}`);
    logger.endRequest(req, res);
  }
}

module.exports = CommentRoute;
