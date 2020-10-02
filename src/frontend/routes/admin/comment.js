'use strict';

const {commentAdapter} = require(`../../adapters`);
const routeName = require(`../../route-name`);
const {logger} = require(`../../utils`);

class CommentRoute {
  constructor() {
    this.post = this.post.bind(this);
  }

  async post(req, res) {
    const {commentId} = req.params;
    const {action} = req.body;

    if (action === `delete`) {
      await commentAdapter.deleteItem(commentId);
    }
    res.redirect(`/${routeName.MY}/${routeName.COMMENTS}`);
    logger.endRequest(req, res);
  }
}

module.exports = CommentRoute;