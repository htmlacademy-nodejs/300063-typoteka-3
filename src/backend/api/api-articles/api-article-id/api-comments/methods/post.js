'use strict';

const HttpCodes = require(`http-status-codes`);

const {db} = require(`../../../../../db`);
const {ECommentFieldName} = require(`../../../../../models`);
const {logger} = require(`../../../../../utils`);


module.exports = async (req, res) => {
  const {text} = req.body;
  if (!text) {
    res.status(HttpCodes.BAD_REQUEST).send(`Text field can't be empty`);
  } else {
    const comment = await db.Comment.create({
      [ECommentFieldName.TEXT]: text,
    });
    res.status(HttpCodes.CREATED).send({
      id: comment[ECommentFieldName.ID],
      text: comment[ECommentFieldName.TEXT],
      date: comment[ECommentFieldName.DATE],
    });
  }
  logger.endRequest(req, res);
};
