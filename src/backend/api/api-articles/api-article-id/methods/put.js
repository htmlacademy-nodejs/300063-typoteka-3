'use strict';

const HttpCodes = require(`http-status-codes`);

const {db} = require(`../../../../db`);
const {EArticleFieldName, ECategoryFieldName} = require(`../../../../models`);
const {logger} = require(`../../../../utils`);


module.exports = async (req, res) => {
  const article = await db.Article.findByPk(req.params.articleId, {
    attributes: [
      EArticleFieldName.ID,
      EArticleFieldName.TITLE,
      EArticleFieldName.ANNOUNCE,
      EArticleFieldName.TEXT,
      EArticleFieldName.IMAGE,
      EArticleFieldName.DATE,
    ],
  });
  article[EArticleFieldName.TITLE] = req.body.title;
  article[EArticleFieldName.ANNOUNCE] = req.body.announce;
  article[EArticleFieldName.TEXT] = req.body.text;
  article[EArticleFieldName.IMAGE] = req.body.image;
  article.save();

  await article.removeCategories(article.Categories);
  await article.addCategories(req.body.categories);
  const categories = await article.getCategories({raw: true});
  const updatedArticle = {
    [EArticleFieldName.ID]: article[EArticleFieldName.ID],
    [EArticleFieldName.TITLE]: article[EArticleFieldName.TITLE],
    [EArticleFieldName.ANNOUNCE]: article[EArticleFieldName.ANNOUNCE],
    [EArticleFieldName.TEXT]: article[EArticleFieldName.TEXT],
    [EArticleFieldName.IMAGE]: article[EArticleFieldName.IMAGE],
    date: article[EArticleFieldName.DATE],
    categories: categories.map((category) => category[ECategoryFieldName.TITLE]),
  };
  res.status(HttpCodes.OK).send(updatedArticle);
  logger.endRequest(req, res);
};
