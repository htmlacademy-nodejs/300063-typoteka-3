'use strict';

const {db} = require(`../db`);


module.exports = async (req, res, next) => {
  const {tokenData} = req.locals;
  if (tokenData) {
    req.locals.account = await db.Account.findByPk(tokenData.id);
  }
  next();
};
