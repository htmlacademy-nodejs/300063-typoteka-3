'use strict';

const HttpCodes = require(`http-status-codes`);


module.exports = (req, res, next) => {
  const {tokenData, account} = req.locals;
  if (!tokenData) {
    res.sendStatus(HttpCodes.UNAUTHORIZED);
    return;
  }
  if (!account) {
    res.sendStatus(HttpCodes.FORBIDDEN);
    return;
  }
  next();
};
