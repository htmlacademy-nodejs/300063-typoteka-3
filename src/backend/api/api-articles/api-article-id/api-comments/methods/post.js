'use strict';

const HttpCodes = require(`http-status-codes`);

const {db} = require(`../../../../../db`);
const {logger} = require(`../../../../../utils`);


module.exports = async (req, res) => {
  const {text} = req.body;
  if (!text) {
    res.status(HttpCodes.BAD_REQUEST).send(`Text field can't be empty`);
  } else {
    const comment = await db.Comment.create({text});
    res.status(HttpCodes.CREATED).send(comment);
  }
  logger.endRequest(req, res);
};
