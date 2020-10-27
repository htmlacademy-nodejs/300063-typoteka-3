'use strict';

const HttpCodes = require(`http-status-codes`);

const {db} = require(`../../db`);
const {EArticleFieldName, ECategoryFieldName, EModelName} = require(`../../models`);
const {logger} = require(`../../utils`);


class ArticleRoute {
  constructor() {
    this.get = this.get.bind(this);
    this.put = this.put.bind(this);
    this.delete = this.delete.bind(this);
  }

  async get(req, res) {
    const {articleId} = req.params;
    const article = await db.Article.findByPk(articleId, {
      attributes: [
        EArticleFieldName.ID,
        EArticleFieldName.TITLE,
        EArticleFieldName.ANNOUNCE,
        EArticleFieldName.TEXT,
        EArticleFieldName.IMAGE,
        EArticleFieldName.DATE,
      ],
      include: [{
        attributes: [
          ECategoryFieldName.ID,
          ECategoryFieldName.TITLE
        ],
        model: db.Category,
        as: EModelName.CATEGORIES,
      }],
    });
    const commentCount = await db.Comment.count({
      where: {articleId},
    });
    if (article) {
      const createdArticle = {
        [EArticleFieldName.ID]: article[EArticleFieldName.ID],
        [EArticleFieldName.TITLE]: article[EArticleFieldName.TITLE],
        [EArticleFieldName.ANNOUNCE]: article[EArticleFieldName.ANNOUNCE],
        [EArticleFieldName.TEXT]: article[EArticleFieldName.TEXT],
        [EArticleFieldName.IMAGE]: article[EArticleFieldName.IMAGE],
        [EArticleFieldName.DATE]: article[EArticleFieldName.DATE],
        categories: article[EModelName.CATEGORIES],
        commentCount,
      };
      res.status(HttpCodes.OK).send(createdArticle);
    } else {
      res.status(HttpCodes.NOT_FOUND).send({errorMessages: [`Публикации с ${articleId} id не существует`]});
    }
    logger.endRequest(req, res);
  }

  async put(req, res) {
    const {title, announce, text, image, date, categories} = req.body;
    const {articleId} = req.params;

    const article = await db.Article.findByPk(articleId, {
      attributes: [
        EArticleFieldName.ID,
        EArticleFieldName.TITLE,
        EArticleFieldName.ANNOUNCE,
        EArticleFieldName.TEXT,
        EArticleFieldName.IMAGE,
        EArticleFieldName.DATE,
      ],
    });
    if (!article) {
      res.status(HttpCodes.BAD_REQUEST).send({errorMessages: [`Публикации с ${articleId} id не существует`]});
      logger.endRequest(req, res);
      return;
    }
    article[EArticleFieldName.TITLE] = title || article[EArticleFieldName.TITLE];
    article[EArticleFieldName.ANNOUNCE] = announce || article[EArticleFieldName.ANNOUNCE];
    article[EArticleFieldName.TEXT] = text || article[EArticleFieldName.TEXT];
    article[EArticleFieldName.IMAGE] = image || article[EArticleFieldName.IMAGE];
    article[EArticleFieldName.DATE] = date || article[EArticleFieldName.DATE];
    await article.save();
    const articleCategories = await article.getCategories();
    await article.removeCategories(articleCategories);
    await article.addCategories(categories);
    const categoryList = await article.getCategories({raw: true});
    const updatedArticle = {
      [EArticleFieldName.ID]: article[EArticleFieldName.ID],
      [EArticleFieldName.TITLE]: article[EArticleFieldName.TITLE],
      [EArticleFieldName.ANNOUNCE]: article[EArticleFieldName.ANNOUNCE],
      [EArticleFieldName.TEXT]: article[EArticleFieldName.TEXT],
      [EArticleFieldName.IMAGE]: article[EArticleFieldName.IMAGE],
      [EArticleFieldName.DATE]: article[EArticleFieldName.DATE],
      categories: categoryList.map((category) => category[ECategoryFieldName.TITLE]),
    };
    res.status(HttpCodes.OK).send(updatedArticle);
    logger.endRequest(req, res);
  }

  async delete(req, res) {
    const {articleId} = req.params;
    const articleDeletedCount = await db.Article.destroy({
      where: {
        id: articleId,
      },
    });
    if (articleDeletedCount > 0) {
      res.status(HttpCodes.NO_CONTENT).send();
    } else {
      res.status(HttpCodes.BAD_REQUEST).send({message: `Публикации с ${req.params.articleId} id не существует`});
    }
    logger.endRequest(req, res);
  }
}

module.exports = ArticleRoute;
