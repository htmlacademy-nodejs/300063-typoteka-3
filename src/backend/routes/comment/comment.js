'use strict';

const HttpCodes = require(`http-status-codes`);

const {db} = require(`../../db`);
const {
  EModelName,
  EAccountFieldName,
  EArticleFieldName,
  ECommentFieldName,
} = require(`../../models`);
const {logger} = require(`../../utils`);


class ApiComment {
  constructor() {
    this.delete = this.delete.bind(this);
  }

  async get(req, res) {
    const {commentId} = req.params;
    const comment = await db.Comment.findByPk(commentId, {
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
    });
    if (comment) {
      res.status(HttpCodes.OK).json({
        [ECommentFieldName.ID]: comment[ECommentFieldName.ID],
        [ECommentFieldName.TEXT]: comment[ECommentFieldName.TEXT],
        date: comment[ECommentFieldName.DATE],
        account: comment[EModelName.ACCOUNTS],
        article: comment[EModelName.ARTICLES],
      });
    } else {
      res.status(HttpCodes.BAD_REQUEST).send({errorMessages: [`Комментария с id ${commentId} не существует `]});
    }
    logger.endRequest(req, res);
  }

  async delete(req, res) {
    const {commentId} = req.params;
    const articleDeletedCount = await db.Comment.destroy({
      where: {
        id: commentId,
      }
    });
    if (articleDeletedCount > 0) {
      res.status(HttpCodes.NO_CONTENT).send();
    } else {
      res.status(HttpCodes.BAD_REQUEST).send({errorMessages: [`Комментария с id ${commentId} не существует `]});
    }
    logger.endRequest(req, res);
  }
}

module.exports = ApiComment;
