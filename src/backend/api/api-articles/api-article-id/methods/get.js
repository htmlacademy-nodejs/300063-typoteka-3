'use strict';

const HttpCodes = require(`http-status-codes`);

const {db, sequelize} = require(`../../../../db`);
const {EArticleFieldName, ECategoryFieldName, EForeignKey, EModelName} = require(`../../../../models`);
const {logger} = require(`../../../../utils`);


module.exports = async (req, res) => {
  const article = await db.Article.findByPk(req.params.articleId, {
    group: [
      [EModelName.ARTICLES, EArticleFieldName.ID].join(`.`),
      [EModelName.CATEGORIES, EModelName.ARTICLE_CATEGORY, EForeignKey.ARTICLE_ID].join(`.`),
    ],
    attributes: [
      EArticleFieldName.ID,
      EArticleFieldName.TITLE,
      EArticleFieldName.ANNOUNCE,
      EArticleFieldName.TEXT,
      EArticleFieldName.IMAGE,
      [EArticleFieldName.DATE, `date`],
      [sequelize.Sequelize.fn(
          `ARRAY_AGG`,
          sequelize.Sequelize.col(
              [EModelName.CATEGORIES, ECategoryFieldName.TITLE].join(`.`)
          )
      ), `categories`]
    ],
    includeIgnoreAttributes: false,
    include: [EModelName.CATEGORIES],
  });
  res.status(HttpCodes.OK).send(article);
  logger.endRequest(req, res);
};
