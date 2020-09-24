'use strict';

module.exports = (req, res, next) => {
  const {account} = req.locals;
  if (account) {
    res.redirect(`/`);
  }
  next();
};
