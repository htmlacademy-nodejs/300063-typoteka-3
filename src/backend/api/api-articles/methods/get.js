'use strict';

const HttpCodes = require(`http-status-codes`);

const {db, sequelize} = require(`../../../db`);
const {
  EArticleFieldName,
  ECategoryFieldName,
  EForeignKey,
  EModelName
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
    ARRAY_AGG("${EModelName.CATEGORIES}"."${ECategoryFieldName.TITLE}") AS "categories",
    COALESCE(COUNT("comments"."count"), 0) AS "commentCount"
  FROM "${EModelName.ARTICLES}"
  LEFT JOIN "${EModelName.ARTICLE_CATEGORY}"
    ON "${EModelName.ARTICLE_CATEGORY}"."${EForeignKey.ARTICLE_ID}" = "${EModelName.ARTICLES}"."${EArticleFieldName.ID}"
  LEFT JOIN "${EModelName.CATEGORIES}"
    ON "${EModelName.ARTICLE_CATEGORY}"."${EForeignKey.CATEGORY_ID}" = "${EModelName.CATEGORIES}"."${EArticleFieldName.ID}"
  LEFT JOIN (
    SELECT
      "${EModelName.COMMENTS}"."${EForeignKey.ARTICLE_ID}",
      COUNT("${EModelName.COMMENTS}"."${EForeignKey.ARTICLE_ID}") AS "count"
    FROM "${EModelName.COMMENTS}"
    GROUP BY "${EModelName.COMMENTS}"."${EForeignKey.ARTICLE_ID}"
  ) AS "comments"
    ON "comments"."${EForeignKey.ARTICLE_ID}" = "${EModelName.ARTICLES}"."${EArticleFieldName.ID}"
  GROUP BY "${EModelName.ARTICLES}"."${EArticleFieldName.ID}", "comments"."count"
  ORDER BY "${EModelName.ARTICLES}"."${EArticleFieldName.DATE}"
  LIMIT :limit
  OFFSET :offset
`;

module.exports = async (req, res) => {
  let offset = 0;
  let limit = null;
  if (req.query.page) {
    limit = req.query.limit;
    offset = req.query.limit * (req.query.page - 1);
  }
  const articles = await sequelize.query(articlesSql, {
    type: sequelize.QueryTypes.SELECT,
    replacements: {
      limit,
      offset,
    }
  });
  const articleCount = await db.Article.count();
  res.status(HttpCodes.OK).send({
    list: articles,
    length: articleCount
  });
  logger.endRequest(req, res);
};
