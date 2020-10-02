'use strict';

module.exports = (req, res, next) => {
  const {account} = req.locals;
  if (account && account.isAdmin) {
    next();
    return;
  }
  res.redirect(`/not-found`);
};
