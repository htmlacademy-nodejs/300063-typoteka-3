'use strict';

const routeName = require(`../route-name`);

module.exports = (req, res, next) => {
  const {account} = req.locals;
  if (account && account.isAdmin) {
    next();
    return;
  }
  res.redirect(`/${routeName.NOT_FOUND}`);
};
