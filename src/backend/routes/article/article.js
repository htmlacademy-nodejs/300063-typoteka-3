'use strict';

const HttpCodes = require(`http-status-codes`);

const {db, sequelize} = require(`../../db`);
const {EArticleFieldName, ECategoryFieldName, EForeignKey, EModelName} = require(`../../models`);
const {logger} = require(`../../utils`);


class ApiArticle {
  constructor() {
    this.get = this.get.bind(this);
    this.put = this.put.bind(this);
    this.delete = this.delete.bind(this);
  }

  async get(req, res) {
    const {articleId} = req.params;
    const article = await db.Article.findByPk(articleId, {
      group: [
        [EModelName.ARTICLES, EArticleFieldName.ID].join(`.`),
        [EModelName.CATEGORIES, EModelName.ARTICLE_CATEGORY, EForeignKey.ARTICLE_ID].join(`.`),
      ],
      attributes: [
        EArticleFieldName.ID,
        EArticleFieldName.TITLE,
        EArticleFieldName.ANNOUNCE,
        EArticleFieldName.TEXT,
        EArticleFieldName.IMAGE,
        EArticleFieldName.DATE,
        [sequelize.Sequelize.fn(
            `ARRAY_AGG`,
            sequelize.Sequelize.col(
                [EModelName.CATEGORIES, ECategoryFieldName.TITLE].join(`.`)
            )
        ), `categories`]
      ],
      includeIgnoreAttributes: false,
      include: [EModelName.CATEGORIES],
    });
    res.status(HttpCodes.OK).send(article);
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
      res.status(HttpCodes.BAD_REQUEST).send({message: `Article with ${req.params.articleId} id isn't exist`});
    }
    logger.endRequest(req, res);
  }
}

module.exports = ApiArticle;
