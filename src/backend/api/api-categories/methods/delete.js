'use strict';

const HttpCodes = require(`http-status-codes`);

const {db} = require(`../../../db`);
const {logger} = require(`../../../utils`);


module.exports = async (req, res) => {
  const {categoryId: id} = req.params;
  await db.Category.destroy({
    where: {
      id,
    },
  });
  res.status(HttpCodes.NO_CONTENT).send();
  logger.endRequest(req, res);
};
