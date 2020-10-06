'use strict';

const HttpCodes = require(`http-status-codes`);

const {db, sequelize} = require(`../../db`);
const {EModelName, EArticleFieldName, ECategoryFieldName, EForeignKey} = require(`../../models`);
const {logger} = require(`../../utils`);


class ApiArticles {
  constructor() {
    this._sortingTypes = [`commentCount`, EArticleFieldName.DATE];
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
  }

  async get(req, res) {
    const articles = await this._getArticles(req);
    const articleCount = await this._getArticleCount(req);
    res.status(HttpCodes.OK).send({
      list: articles,
      length: articleCount
    });
    logger.endRequest(req, res);
  }

  async post(req, res) {
    const {title, announce, text, image, categories, date} = req.body;
    const articleRes = await db.Article.create({
      title,
      announce,
      text,
      image,
      date,
    });
    await articleRes.addCategories(categories);
    const articleCategories = await articleRes.getCategories({raw: true});
    const article = {
      id: articleRes[EArticleFieldName.ID],
      title: articleRes[EArticleFieldName.TITLE],
      announce: articleRes[EArticleFieldName.ANNOUNCE],
      text: articleRes[EArticleFieldName.TEXT],
      image: articleRes[EArticleFieldName.IMAGE],
      date: articleRes[EArticleFieldName.DATE],
      categories: articleCategories.map((category) => category[ECategoryFieldName.TITLE])
    };
    res.status(HttpCodes.CREATED).send(article);
    logger.endRequest(req, res);
  }

  async _getArticles(req) {
    const {page = null, limit = null, minCommentCount = null, title = null} = req.query;
    const {account} = req.locals;
    const category = +req.query.category || null;
    const offset = page && limit && (limit * (page - 1));
    const articlesSql = this._getArticleSql(req);
    const search = title === null ? title : `%${title}%`;
    const isAdmin = Boolean(account) && account.isAdmin;
    return await sequelize.query(articlesSql, {
      type: sequelize.QueryTypes.SELECT,
      replacements: {
        limit,
        offset,
        category,
        minCommentCount,
        search,
        isAdmin,
      },
    });
  }

  _getArticleSql(req) {
    const sort = this._sortingTypes.includes(req.query.sort) ? req.query.sort : EArticleFieldName.DATE;
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
        (:search IS NULL OR "${EModelName.ARTICLES}"."${EArticleFieldName.TITLE}" ILIKE :search)
        AND (:minCommentCount IS NULL OR "comments"."count" >= :minCommentCount)
        AND (:isAdmin = 'true' OR "${EModelName.ARTICLES}"."${EArticleFieldName.DATE}" <= NOW())
      GROUP BY "${EModelName.ARTICLES}"."${EArticleFieldName.ID}", "comments"."count"
      ORDER BY "${sort}" DESC
      LIMIT :limit
      OFFSET :offset
    `;
  }

  async _getArticleCount(req) {
    const category = +req.query.category || null;
    const articleFilterParams = {};
    if (category) {
      articleFilterParams.include = [{
        model: db.Category,
        as: EModelName.CATEGORIES,
        where: {id: category},
      }];
    }
    return await db.Article.count(articleFilterParams);
  }
}

module.exports = ApiArticles;
