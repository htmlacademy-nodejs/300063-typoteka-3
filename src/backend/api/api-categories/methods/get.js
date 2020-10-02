'use strict';

const HttpCodes = require(`http-status-codes`);

const {db} = require(`../../../db`);
const {logger} = require(`../../../utils`);


module.exports = async (req, res) => {
  const categories = await db.Category.findAll();
  res.status(HttpCodes.OK).send(categories);
  logger.endRequest(req, res);
};
