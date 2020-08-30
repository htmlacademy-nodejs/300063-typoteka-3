'use strict';

const HttpCodes = require(`http-status-codes`);

const {sequelize} = require(`../../../db`);
const {
  EArticleFieldName,
  ECategoryFieldName,
  EForeignKey,
  EModelName,
} = require(`../../../models`);
const {logger} = require(`../../../utils`);


const articlesSql = `
  SELECT
    "${EModelName.ARTICLES}"."${EArticleFieldName.ID}",
    "${EModelName.ARTICLES}"."${EArticleFieldName.TITLE}",
    "${EModelName.ARTICLES}"."${EArticleFieldName.ANNOUNCE}",
    "${EModelName.ARTICLES}"."${EArticleFieldName.TEXT}",
    "${EModelName.ARTICLES}"."${EArticleFieldName.IMAGE}",
    "${EModelName.ARTICLES}"."${EArticleFieldName.DATE}" AS "date",
    ARRAY_AGG("${EModelName.CATEGORIES}"."${ECategoryFieldName.TITLE}") AS "categories"
  FROM "${EModelName.ARTICLES}"
    INNER JOIN "${EModelName.ARTICLE_CATEGORY}"
      ON "${EModelName.ARTICLE_CATEGORY}"."${EForeignKey.ARTICLE_ID}" = "${EModelName.ARTICLES}"."${EArticleFieldName.ID}"
    INNER JOIN "${EModelName.CATEGORIES}"
      ON "${EModelName.ARTICLE_CATEGORY}"."${EForeignKey.CATEGORY_ID}" = "${EModelName.CATEGORIES}"."${EArticleFieldName.ID}"
  GROUP BY "${EModelName.ARTICLES}"."${EArticleFieldName.ID}"
  LIMIT :limit;
`;

module.exports = async (req, res) => {

  const articles = await sequelize.query(articlesSql, {
    type: sequelize.QueryTypes.SELECT,
    replacements: {
      limit: 10,
    }
  });
  res.status(HttpCodes.OK).send(articles);
  logger.endRequest(req, res);
};
