'use strict';

module.exports = (req, res, next) => {
  req.locals = {
    isUnauthorized: true,
    account: null,
  };
  next();
};
