'use strict';

const HttpCodes = require(`http-status-codes`);

const {db} = require(`../../../../db`);
const {EArticleFieldName, ECategoryFieldName} = require(`../../../../models`);
const {logger} = require(`../../../../utils`);


module.exports = async (req, res) => {
  const {title, announce, text, image, createdAt, categories} = req.body;
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
  article[EArticleFieldName.TITLE] = title || article[EArticleFieldName.TITLE];
  article[EArticleFieldName.ANNOUNCE] = announce || article[EArticleFieldName.ANNOUNCE];
  article[EArticleFieldName.TEXT] = text || article[EArticleFieldName.TEXT];
  article[EArticleFieldName.IMAGE] = image || article[EArticleFieldName.IMAGE];
  article[EArticleFieldName.DATE] = createdAt || article[EArticleFieldName.DATE];
  await article.save();
  await article.removeCategories(article.Categories);
  await article.addCategories(categories);
  const categoryList = await article.getCategories({raw: true});
  const updatedArticle = {
    [EArticleFieldName.ID]: article[EArticleFieldName.ID],
    [EArticleFieldName.TITLE]: article[EArticleFieldName.TITLE],
    [EArticleFieldName.ANNOUNCE]: article[EArticleFieldName.ANNOUNCE],
    [EArticleFieldName.TEXT]: article[EArticleFieldName.TEXT],
    [EArticleFieldName.IMAGE]: article[EArticleFieldName.IMAGE],
    date: article[EArticleFieldName.DATE],
    categories: categoryList.map((category) => category[ECategoryFieldName.TITLE]),
  };
  res.status(HttpCodes.OK).send(updatedArticle);
  logger.endRequest(req, res);
};
