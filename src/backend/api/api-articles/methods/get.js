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
    WHERE
      (:isSearch = 'false' OR "${EModelName.ARTICLES}"."${EArticleFieldName.TITLE}" ILIKE :title)
      AND (:minCommentCount IS NULL OR "comments"."count" >= :minCommentCount)
    GROUP BY "${EModelName.ARTICLES}"."${EArticleFieldName.ID}", "comments"."count"
    ORDER BY "${sort}" DESC
    LIMIT :limit
    OFFSET :offset
  `;
};

const getArticles = async (req) => {
  const {page = null, limit = null, minCommentCount = null, isSearch = `false`} = req.query;
  const title = `%${req.query.title}%`;
  const category = +req.query.category || null;
  const offset = page && limit && (limit * (page - 1));
  const articlesSql = getArticleSql(req);
  return await sequelize.query(articlesSql, {
    type: sequelize.QueryTypes.SELECT,
    replacements: {
      limit,
      offset,
      category,
      minCommentCount,
      title,
      isSearch
    },
  });
};

const getArticleCount = async (req) => {
  const category = +req.query.category || null;

  const articleFilterParams = category && {
    include: [{
      model: db.Category,
      as: EModelName.CATEGORIES,
      where: {id: category},
    }],
  } || {};
  return await db.Article.count(articleFilterParams);
};

module.exports = async (req, res) => {
  const articles = await getArticles(req);
  const articleCount = await getArticleCount(req);

  res.status(HttpCodes.OK).send({
    list: articles,
    length: articleCount
  });
  logger.endRequest(req, res);
};
