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


const sortingTypes = [`commentCount`, EArticleFieldName.DATE];


const getArticleSql = (req) => {
  const sort = sortingTypes.includes(req.query.sort) ? req.query.sort : EArticleFieldName.DATE;

  return `
    SELECT
      "${EModelName.ARTICLES}"."${EArticleFieldName.ID}",
      "${EModelName.ARTICLES}"."${EArticleFieldName.TITLE}",
      "${EModelName.ARTICLES}"."${EArticleFieldName.ANNOUNCE}",
      "${EModelName.ARTICLES}"."${EArticleFieldName.TEXT}",
      "${EModelName.ARTICLES}"."${EArticleFieldName.IMAGE}",
      "${EModelName.ARTICLES}"."${EArticleFieldName.DATE}",
      ARRAY_AGG("${EModelName.CATEGORIES}"."${ECategoryFieldName.TITLE}") AS "categories",
      COALESCE("comments"."count", 0) AS "commentCount"
    FROM "${EModelName.ARTICLES}"
    LEFT JOIN "${EModelName.ARTICLE_CATEGORY}"
      ON "${EModelName.ARTICLE_CATEGORY}"."${EForeignKey.ARTICLE_ID}" = "${EModelName.ARTICLES}"."${EArticleFieldName.ID}"
    LEFT JOIN "${EModelName.CATEGORIES}"
      ON "${EModelName.ARTICLE_CATEGORY}"."${EForeignKey.CATEGORY_ID}" = "${EModelName.CATEGORIES}"."${ECategoryFieldName.ID}"
    LEFT JOIN (
      SELECT
        "${EModelName.COMMENTS}"."${EForeignKey.ARTICLE_ID}",
        COUNT("${EModelName.COMMENTS}"."${EForeignKey.ARTICLE_ID}") AS "count"
      FROM "${EModelName.COMMENTS}"
      WHERE "${EModelName.COMMENTS}"."deletedAt" IS NULL
      GROUP BY "${EModelName.COMMENTS}"."${EForeignKey.ARTICLE_ID}"
    ) AS "comments"
      ON "comments"."${EForeignKey.ARTICLE_ID}" = "${EModelName.ARTICLES}"."${EArticleFieldName.ID}"
    RIGHT JOIN (
      SELECT
        "${EModelName.ARTICLE_CATEGORY}"."${EForeignKey.ARTICLE_ID}",
        COUNT("${EModelName.CATEGORIES}"."${ECategoryFieldName.ID}") AS "categoryCount"
      FROM "${EModelName.ARTICLE_CATEGORY}"
      LEFT JOIN "${EModelName.CATEGORIES}"
        ON "${EModelName.ARTICLE_CATEGORY}"."${EForeignKey.CATEGORY_ID}" = "${EModelName.CATEGORIES}"."${ECategoryFieldName.ID}"
      WHERE :category IS NULL OR "${EModelName.CATEGORIES}"."${ECategoryFieldName.ID}" = :category
      GROUP BY "${EModelName.ARTICLE_CATEGORY}"."${EForeignKey.ARTICLE_ID}"
      ORDER BY "${EModelName.ARTICLE_CATEGORY}"."${EForeignKey.ARTICLE_ID}" DESC
    ) AS "filteredArticlesByCategory"
      ON "filteredArticlesByCategory"."${EForeignKey.ARTICLE_ID}" = "${EModelName.ARTICLES}"."${EArticleFieldName.ID}"
    WHERE "${EModelName.ARTICLES}"."deletedAt" IS NULL
    GROUP BY "${EModelName.ARTICLES}"."${EArticleFieldName.ID}", "comments"."count"
    ORDER BY "${sort}" DESC
    LIMIT :limit
    OFFSET :offset
  `;
};

module.exports = async (req, res) => {
  const {page = null, limit = null} = req.query;
  const category = +req.query.category || null;
  const offset = page && limit && (limit * (page - 1));

  const articlesSql = getArticleSql(req);
  const articles = await sequelize.query(articlesSql, {
    type: sequelize.QueryTypes.SELECT,
    replacements: {
      limit,
      offset,
      category,
    },
  });
  const articleFilterParams = category && {
    include: [{
      model: db.Category,
      as: EModelName.CATEGORIES,
      where: {id: category},
    }],
  } || {};
  const articleCount = await db.Article.count(articleFilterParams);
  res.status(HttpCodes.OK).send({
    list: articles,
    length: articleCount
  });
  logger.endRequest(req, res);
};
