'use strict';

const HttpCodes = require(`http-status-codes`);

const {db} = require(`../../../../../db`);
const {ECommentFieldName, EForeignKey} = require(`../../../../../models`);
const {logger} = require(`../../../../../utils`);


module.exports = async (req, res) => {
  const {articleId} = req.params;
  const {text} = req.body;
  if (!text) {
    res.status(HttpCodes.BAD_REQUEST).send(`Text field can't be empty`);
  } else {
    const comment = await db.Comment.create({
      [ECommentFieldName.TEXT]: text,
      [EForeignKey.ARTICLE_ID]: articleId,
      [EForeignKey.ACCOUNT_ID]: 1,
    });
    res.status(HttpCodes.CREATED).send({
      [ECommentFieldName.ID]: comment[ECommentFieldName.ID],
      [ECommentFieldName.TEXT]: comment[ECommentFieldName.TEXT],
      date: comment[ECommentFieldName.DATE],
      [EForeignKey.ACCOUNT_ID]: comment[EForeignKey.ACCOUNT_ID],
      [EForeignKey.ARTICLE_ID]: comment[EForeignKey.ARTICLE_ID],
    });
  }
  logger.endRequest(req, res);
};
