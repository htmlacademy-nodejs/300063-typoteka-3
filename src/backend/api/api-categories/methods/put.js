'use strict';

const HttpCodes = require(`http-status-codes`);

const {db} = require(`../../../db`);
const {logger} = require(`../../../utils`);


module.exports = async (req, res) => {
  const {categoryId: id} = req.params;
  const {title} = req.body;
  const categories = await db.Category.update({title}, {
    where: {
      id,
    },
  });
  res.status(HttpCodes.OK).send(categories);
  logger.endRequest(req, res);
};
