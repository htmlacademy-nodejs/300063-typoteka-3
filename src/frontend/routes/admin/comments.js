'use strict';

const {logger} = require(`../../utils`);
const {commentAdapter} = require(`../../adapters`);


class CommentsRoute {
  constructor() {
    this.get = this.get.bind(this);
  }

  async get(req, res) {
    const {account} = req.locals;
    const commentList = await commentAdapter.getList();
    const content = {
      account,
      commentList,
      scriptList: [
        `js/socket.io.js`,
        `js/comments.js`
      ],
    };
    res.render(`pages/my/comments`, content);
    logger.endRequest(req, res);
  }
}

module.exports = CommentsRoute;
