'use strict';

const HttpCodes = require(`http-status-codes`);

const {middlewareMessages} = require(`../messages`);


const {FORBIDDEN, UNAUTHORIZED} = middlewareMessages.AuthenticateJwt;

module.exports = (req, res, next) => {
  const {tokenData, account} = req.locals;
  if (!tokenData) {
    res.status(HttpCodes.UNAUTHORIZED).json({errorMessages: [UNAUTHORIZED]});
    return;
  }
  if (!account) {
    res.status(HttpCodes.FORBIDDEN).json({errorMessages: [FORBIDDEN]});
    return;
  }
  next();
};
