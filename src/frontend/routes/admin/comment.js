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
    const {cookie} = req.headers;
    await commentAdapter.deleteItem(commentId, {
      headers: {cookie},
    });
    res.redirect(`/${routeName.MY}/${routeName.COMMENTS}`);
    logger.endRequest(req, res);
  }
}

module.exports = CommentRoute;
