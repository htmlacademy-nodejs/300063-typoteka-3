'use strict';

const HttpCodes = require(`http-status-codes`);

const {db} = require(`../../db`);
const {logger} = require(`../../utils`);


class ApiComment {
  constructor() {
    this.delete = this.delete.bind(this);
  }

  async delete(req, res) {
    const {commentId} = req.params;
    const articleDeletedCount = await db.Comment.destroy({
      where: {
        id: commentId,
      }
    });
    if (articleDeletedCount > 0) {
      res.status(HttpCodes.NO_CONTENT).send();
    } else {
      res.status(HttpCodes.BAD_REQUEST).send({message: `Comment with ${commentId} ID isn't exist`});
    }
    logger.endRequest(req, res);
  }
}

module.exports = ApiComment;
