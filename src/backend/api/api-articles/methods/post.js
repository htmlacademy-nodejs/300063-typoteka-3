'use strict';

const HttpCodes = require(`http-status-codes`);

const {db} = require(`../../../db`);
const {EArticleFieldName, ECategoryFieldName} = require(`../../../models`);
const {logger} = require(`../../../utils`);


const createArticle = async (params) => {
  const {title, announce, text, image, categories, date} = params;
  const article = await db.Article.create({
    title,
    announce,
    text,
    image,
    date,
  });
  await article.addCategories(categories);
  const articleCategories = await article.getCategories({raw: true});
  return {
    id: article[EArticleFieldName.ID],
    title: article[EArticleFieldName.TITLE],
    announce: article[EArticleFieldName.ANNOUNCE],
    text: article[EArticleFieldName.TEXT],
    image: article[EArticleFieldName.IMAGE],
    date: article[EArticleFieldName.DATE],
    categories: articleCategories.map((category) => category[ECategoryFieldName.TITLE])
  };
};

module.exports = async (req, res) => {
  const article = await createArticle(req.body);
  res.status(HttpCodes.CREATED).send(article);
  logger.endRequest(req, res);
};
