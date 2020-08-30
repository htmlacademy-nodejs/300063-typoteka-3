'use strict';

const HttpCodes = require(`http-status-codes`);

const {sequelize} = require(`../../../db`);
const {EModelName, EArticleFieldName, ECategoryFieldName, EForeignKey} = require(`../../../models`);
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
    WHERE "${EModelName.ARTICLES}"."${EArticleFieldName.TITLE}" ILIKE :title
    GROUP BY "${EModelName.ARTICLES}"."${EArticleFieldName.ID}"
    LIMIT :limit;
  `;


module.exports = async (req, res) => {
  const articles = await sequelize.query(articlesSql, {
    type: sequelize.QueryTypes.SELECT,
    replacements: {
      limit: 10,
      title: `%${req.query.title}%`,
    }
  });
  if (articles.length === 0) {
    res.status(HttpCodes.NOT_FOUND).send();
  } else {
    res.status(HttpCodes.OK).send(articles);
  }
  logger.endRequest(req, res);


  // const articleList = articleAdapter.searchByTitle(req.query.title);
  // if (articleList.length === 0) {
  //   res.status(HttpCodes.NOT_FOUND).send();
  //   logger.endRequest(req, res);
  // } else {
  //   res.status(HttpCodes.OK).send(articleList);
  //   logger.endRequest(req, res);
  // }
};
