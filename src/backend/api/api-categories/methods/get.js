'use strict';

const HttpCodes = require(`http-status-codes`);

const {sequelize} = require(`../../../db`);
const {EModelName, ECategoryFieldName, EArticleFieldName, EForeignKey} = require(`../../../models`);
const {logger} = require(`../../../utils`);


module.exports = async (req, res) => {
  const {minArticleCount = 0} = req.query;
  const categorySql = `
    SELECT
      "${EModelName.CATEGORIES}"."${ECategoryFieldName.ID}",
      "${EModelName.CATEGORIES}"."${ECategoryFieldName.TITLE}",
      COALESCE(COUNT("${EModelName.ARTICLE_CATEGORY}"."${EForeignKey.CATEGORY_ID}"), 0) as "articleCount"
    FROM "${EModelName.CATEGORIES}"
    LEFT JOIN "${EModelName.ARTICLE_CATEGORY}"
      ON "${EModelName.ARTICLE_CATEGORY}"."${EForeignKey.CATEGORY_ID}" = "${EModelName.CATEGORIES}"."${ECategoryFieldName.ID}"
    LEFT JOIN "${EModelName.ARTICLES}"
      ON "${EModelName.ARTICLE_CATEGORY}"."${EForeignKey.ARTICLE_ID}" = "${EModelName.ARTICLES}"."${EArticleFieldName.ID}"
    GROUP BY "${EModelName.CATEGORIES}"."${ECategoryFieldName.ID}"
    HAVING COUNT("${EModelName.ARTICLE_CATEGORY}"."${EForeignKey.CATEGORY_ID}") >= :minArticleCount
    ORDER BY "${EModelName.CATEGORIES}"."${ECategoryFieldName.ID}";
  `;
  const categories = await sequelize.query(categorySql, {
    type: sequelize.QueryTypes.SELECT,
    replacements: {
      minArticleCount,
    }
  });
  res.status(HttpCodes.OK).send(categories);
  logger.endRequest(req, res);
};
