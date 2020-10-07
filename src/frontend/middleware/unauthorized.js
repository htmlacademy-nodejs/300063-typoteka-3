'use strict';

const routeName = require(`../route-name`);


module.exports = (req, res, next) => {
  const {account} = req.locals;
  if (account) {
    res.redirect(`/${routeName.MAIN}`);
  }
  next();
};
