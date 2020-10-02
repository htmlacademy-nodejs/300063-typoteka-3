'use strict';

const HttpCodes = require(`http-status-codes`);

const {db} = require(`../../../db`);
const {logger} = require(`../../../utils`);


module.exports = async (req, res) => {
  const {title} = req.body;
  const categories = await db.Category.create({title});
  res.status(HttpCodes.CREATED).send(categories);
  logger.endRequest(req, res);
};
