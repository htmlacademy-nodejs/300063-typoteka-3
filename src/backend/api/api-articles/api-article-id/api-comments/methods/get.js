'use strict';

const HttpCodes = require(`http-status-codes`);

const {db} = require(`../../../../../db`);
const {
  EModelName,
  EAccountFieldName,
  ECommentFieldName,
} = require(`../../../../../models`);
const {deletedAccount} = require(`../../../../../placeholders`);
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
    }],
    where: {
      articleId,
    },
  });
  return comments.map((comment) => {
    let account = deletedAccount;
    if (comment[EModelName.ACCOUNTS]) {
      account = {
        id: comment[EModelName.ACCOUNTS][EAccountFieldName.ID],
        firstname: comment[EModelName.ACCOUNTS][EAccountFieldName.FIRSTNAME],
        lastname: comment[EModelName.ACCOUNTS][EAccountFieldName.LASTNAME],
        email: comment[EModelName.ACCOUNTS][EAccountFieldName.EMAIL],
        avatar: comment[EModelName.ACCOUNTS][EAccountFieldName.AVATAR],
      };
    }

    return {
      id: comment[ECommentFieldName.ID],
      text: comment[ECommentFieldName.TEXT],
      date: comment[ECommentFieldName.DATE],
      account,
    };
  });
};


module.exports = async (req, res) => {
  const article = await db.Article.findByPk(req.params.articleId);
  if (!article) {
    res.status(HttpCodes.BAD_REQUEST).send(`Article with ${req.params.articleId} ID isn't exist`);
  } else {
    const comments = await getCommentsByArticle(req.params.articleId);
    res.status(HttpCodes.OK).send(comments);
  }
  logger.endRequest(req, res);
};
