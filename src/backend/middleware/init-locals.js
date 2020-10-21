'use strict';

module.exports = (req, res, next) => {
  req.locals = {
    tokenData: null,
    account: null,
  };
  next();
};
