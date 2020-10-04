'use strict';

const HttpCodes = require(`http-status-codes`);

const {db, sequelize} = require(`../../db`);
const {EModelName, ECategoryFieldName, EForeignKey} = require(`../../models`);
const {logger} = require(`../../utils`);


class ApiCategories {
  constructor() {
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);

    this._categorySql = `
      SELECT
        "${EModelName.CATEGORIES}"."${ECategoryFieldName.ID}",
        "${EModelName.CATEGORIES}"."${ECategoryFieldName.TITLE}",
        "articlesCategoryCount"."articleCount"
      FROM "${EModelName.CATEGORIES}"
      LEFT JOIN "${EModelName.ARTICLE_CATEGORY}"
        ON "${EModelName.ARTICLE_CATEGORY}"."${EForeignKey.CATEGORY_ID}" = "${EModelName.CATEGORIES}"."${ECategoryFieldName.ID}"
      RIGHT JOIN (
        SELECT
          "${EModelName.CATEGORIES}"."${ECategoryFieldName.ID}",
          COALESCE(COUNT("${EModelName.CATEGORIES}"."${ECategoryFieldName.ID}"), 0) as "articleCount"
        FROM "${EModelName.CATEGORIES}"
        LEFT JOIN "${EModelName.ARTICLE_CATEGORY}"
          ON "${EModelName.ARTICLE_CATEGORY}"."${EForeignKey.CATEGORY_ID}" = "${EModelName.CATEGORIES}"."${ECategoryFieldName.ID}"
        GROUP BY "${EModelName.CATEGORIES}"."${ECategoryFieldName.ID}"
        HAVING COUNT("${EModelName.CATEGORIES}"."${ECategoryFieldName.ID}") >= :minArticleCount
      ) AS "articlesCategoryCount"
        ON "articlesCategoryCount"."${ECategoryFieldName.ID}" = "${EModelName.CATEGORIES}"."${ECategoryFieldName.ID}"
      WHERE
        :articleId IS NULL
        OR "${EModelName.ARTICLE_CATEGORY}"."${EForeignKey.ARTICLE_ID}" = :articleId
      GROUP BY "${EModelName.CATEGORIES}"."${ECategoryFieldName.ID}", "articlesCategoryCount"."articleCount"
      ORDER BY "${EModelName.CATEGORIES}"."${ECategoryFieldName.ID}"
    `;
  }

  async get(req, res) {
    const {minArticleCount = 0, articleId = null} = req.query;
    const categories = await sequelize.query(this._categorySql, {
      type: sequelize.QueryTypes.SELECT,
      replacements: {
        minArticleCount,
        articleId,
      }
    });
    res.status(HttpCodes.OK).send(categories);
    logger.endRequest(req, res);
  }

  async post(req, res) {
    const {title} = req.body;
    const categories = await db.Category.create({title});
    res.status(HttpCodes.CREATED).send(categories);
    logger.endRequest(req, res);
  }
}

module.exports = ApiCategories;
