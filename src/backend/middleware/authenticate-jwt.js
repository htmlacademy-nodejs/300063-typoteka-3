'use strict';

const HttpCodes = require(`http-status-codes`);


module.exports = (req, res, next) => {
  const {isUnauthorized, account} = req.locals;
  if (isUnauthorized) {
    res.sendStatus(HttpCodes.UNAUTHORIZED);
    return;
  }
  if (!account) {
    res.sendStatus(HttpCodes.FORBIDDEN);
    return;
  }
  next();
};
