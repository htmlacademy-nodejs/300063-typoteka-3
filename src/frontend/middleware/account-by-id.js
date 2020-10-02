'use strict';

const {accountAdapter} = require(`../adapters`);


module.exports = async (req, res, next) => {
  const {accountData} = req.locals;
  req.locals.account = null;
  if (accountData) {
    req.locals.account = await accountAdapter.getItemById(accountData.id);
  }
  next();
};
