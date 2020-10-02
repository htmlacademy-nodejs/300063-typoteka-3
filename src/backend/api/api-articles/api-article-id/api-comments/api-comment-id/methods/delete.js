'use strict';

const HttpCodes = require(`http-status-codes`);

const {db} = require(`../../../../../../db`);
const {logger} = require(`../../../../../../utils`);


module.exports = async (req, res) => {
  const article = await db.Article.findByPk(req.params.articleId);
  if (!article) {
    res.status(HttpCodes.BAD_REQUEST).send({message: `Article with ${req.params.articleId} ID isn't exist`});
    logger.endRequest(req, res);
    return;
  }
  const articleDeletedCount = await db.Comment.destroy({
    where: {
      id: req.params.commentId,
    }
  });
  if (articleDeletedCount > 0) {
    res.status(HttpCodes.NO_CONTENT).send();
  } else {
    res.status(HttpCodes.BAD_REQUEST).send({message: `Comment with ${req.params.commentId} ID isn't exist`});
  }
  logger.endRequest(req, res);
};
