'use strict';

const HttpCodes = require(`http-status-codes`);

const {db} = require(`../../../db`);
const {
  EAccountFieldName,
  EAccountTypeFieldName,
  ECommentFieldName,
  EModelName,
  EForeignKey,
} = require(`../../../models`);
const deletedAccount = require(`../../../placeholders`);


const getComments = async (req) => {
  const {limit} = req.query;
  const comments = await db.Comment.findAll({
    attributes: [
      ECommentFieldName.ID,
      ECommentFieldName.TEXT,
      ECommentFieldName.DATE,
      EForeignKey.ARTICLE_ID,
    ],
    order: [
      [ECommentFieldName.DATE, `DESC`],
    ],
    limit,
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
        type: comment[EModelName.ACCOUNTS][EModelName.ACCOUNT_TYPES][EAccountTypeFieldName.TITLE],
      };
    }

    return {
      id: comment[ECommentFieldName.ID],
      text: comment[ECommentFieldName.TEXT],
      date: comment[ECommentFieldName.DATE],
      articleId: comment[EForeignKey.ARTICLE_ID],
      account,
    };
  });
};

module.exports = async (req, res) => {
  const comments = await getComments(req);
  res.status(HttpCodes.OK).send(comments);
};
