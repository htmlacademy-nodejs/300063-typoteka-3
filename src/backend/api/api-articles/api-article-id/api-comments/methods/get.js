'use strict';

const HttpCodes = require(`http-status-codes`);

const {db} = require(`../../../../../db`);
const {
  EModelName,
  EAccountFieldName,
  ECommentFieldName,
  EAccountTypeFieldName,
} = require(`../../../../../models`);
const {logger} = require(`../../../../../utils`);

const getCommentsByArticle = async (articleId) => {
  const comments = await db.Comment.findAll({
    attributes: [
      ECommentFieldName.ID,
      ECommentFieldName.TEXT,
      ECommentFieldName.DATE,
    ],
    include: [{
      model: db.Account,
      as: EModelName.ACCOUNTS,
      attributes: [
        EAccountFieldName.ID,
        EAccountFieldName.FIRSTNAME,
        EAccountFieldName.LASTNAME,
        EAccountFieldName.EMAIL,
        EAccountFieldName.AVATAR
      ],
      include: {
        model: db.AccountType,
        as: EModelName.ACCOUNT_TYPES,
        attributes: [EAccountTypeFieldName.TITLE],
      },
    }],
    where: {
      articleId,
    },
  });
  return comments.map((comment) => ({
    id: comment[ECommentFieldName.ID],
    text: comment[ECommentFieldName.TEXT],
    date: comment[ECommentFieldName.DATE],
    account: {
      id: comment[EModelName.ACCOUNTS][EAccountFieldName.ID],
      firstname: comment[EModelName.ACCOUNTS][EAccountFieldName.FIRSTNAME],
      lastname: comment[EModelName.ACCOUNTS][EAccountFieldName.LASTNAME],
      email: comment[EModelName.ACCOUNTS][EAccountFieldName.EMAIL],
      avatar: comment[EModelName.ACCOUNTS][EAccountFieldName.AVATAR],
      type: comment[EModelName.ACCOUNTS][EModelName.ACCOUNT_TYPES][EAccountTypeFieldName.TITLE],
    }
  }));
};


module.exports = async (req, res) => {
  const article = await db.Article.findByPk(req.params.articleId);
  if (!article) {
    res.status(HttpCodes.BAD_REQUEST).send(`Article with ${req.params.articleId} ID isn't exist`);
  } else {
    const comments = getCommentsByArticle(req.params.articleId);
    res.status(HttpCodes.OK).send(comments);
  }
  logger.endRequest(req, res);
};
