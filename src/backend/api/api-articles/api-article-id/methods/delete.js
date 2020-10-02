'use strict';

const HttpCodes = require(`http-status-codes`);

const {db} = require(`../../../../db`);
const {logger} = require(`../../../../utils`);


module.exports = async (req, res) => {
  const {articleId} = req.params;
  const articleDeletedCount = await db.Article.destroy({
    where: {
      id: articleId,
    },
  });
  if (articleDeletedCount > 0) {
    res.status(HttpCodes.NO_CONTENT).send();
  } else {
    res.status(HttpCodes.BAD_REQUEST).send({message: `Article with ${req.params.articleId} id isn't exist`});
  }
  logger.endRequest(req, res);
};
