'use strict';

const HttpCodes = require(`http-status-codes`);

const {db} = require(`../../db`);
const {
  EModelName,
  EAccountFieldName,
  EArticleFieldName,
  ECommentFieldName,
  EForeignKey,
} = require(`../../models`);
const {logger} = require(`../../utils`);


class ApiComments {
  constructor() {
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
  }

  async get(req, res) {
    const isNotArticleError = await this._checkArticle(req);
    const status = isNotArticleError ? HttpCodes.OK : HttpCodes.BAD_REQUEST;
    const content = isNotArticleError
      ? await this._getComments(req)
      : `Публикации с id ${req.params.articleId} не существует`;
    res.status(status).send(content);
    logger.endRequest(req, res);
  }

  async post(req, res) {
    const {text, accountId, articleId} = req.body;
    const comment = await db.Comment.create({
      [ECommentFieldName.TEXT]: text,
      [EForeignKey.ARTICLE_ID]: articleId,
      [EForeignKey.ACCOUNT_ID]: accountId,
    });
    res.status(HttpCodes.CREATED).send({
      [ECommentFieldName.ID]: comment[ECommentFieldName.ID],
      [ECommentFieldName.TEXT]: comment[ECommentFieldName.TEXT],
      date: comment[ECommentFieldName.DATE],
      [EForeignKey.ACCOUNT_ID]: comment[EForeignKey.ACCOUNT_ID],
      [EForeignKey.ARTICLE_ID]: comment[EForeignKey.ARTICLE_ID],
    });
    logger.endRequest(req, res);
  }

  async _checkArticle(req) {
    const {articleId = null} = req.query;
    const article = articleId && await db.Article.findByPk(articleId);
    return !articleId || Boolean(article);
  }

  async _getComments(req) {
    const commentQueryParams = this._getCommentQueryParams(req);
    const comments = await db.Comment.findAll(commentQueryParams);
    return this._adaptComments(comments);
  }

  _getCommentQueryParams(req) {
    const {limit = null, articleId} = req.query;
    const commentQueryParams = {
      attributes: [
        ECommentFieldName.ID,
        ECommentFieldName.TEXT,
        ECommentFieldName.DATE,
      ],
      include: [
        {
          model: db.Account,
          as: EModelName.ACCOUNTS,
          attributes: [
            EAccountFieldName.ID,
            EAccountFieldName.FIRSTNAME,
            EAccountFieldName.LASTNAME,
            EAccountFieldName.EMAIL,
            EAccountFieldName.AVATAR
          ],
        },
        {
          model: db.Article,
          as: EModelName.ARTICLES,
          attributes: [
            EArticleFieldName.ID,
            EArticleFieldName.TITLE,
          ],
        }
      ],
      order: [
        [ECommentFieldName.DATE, `DESC`],
      ],
      limit,
    };
    if (articleId) {
      commentQueryParams.where = {
        [EForeignKey.ARTICLE_ID]: articleId,
      };
    }
    return commentQueryParams;
  }

  _adaptComments(comments) {
    return comments.map((comment) => ({
      id: comment[ECommentFieldName.ID],
      text: comment[ECommentFieldName.TEXT],
      date: comment[ECommentFieldName.DATE],
      articleId: comment[EForeignKey.ARTICLE_ID],
      account: {
        id: comment[EModelName.ACCOUNTS][EAccountFieldName.ID],
        firstname: comment[EModelName.ACCOUNTS][EAccountFieldName.FIRSTNAME],
        lastname: comment[EModelName.ACCOUNTS][EAccountFieldName.LASTNAME],
        email: comment[EModelName.ACCOUNTS][EAccountFieldName.EMAIL],
        avatar: comment[EModelName.ACCOUNTS][EAccountFieldName.AVATAR],
      },
      article: {
        id: comment[EModelName.ARTICLES][EArticleFieldName.ID],
        title: comment[EModelName.ARTICLES][EArticleFieldName.TITLE],
      }
    }));
  }
}

module.exports = ApiComments;
