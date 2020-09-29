'use strict';

const HttpCodes = require(`http-status-codes`);
const jwt = require(`jsonwebtoken`);

const {backendParams} = require(`../../common/params`);


let JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || backendParams.JWT_ACCESS_SECRET_DEFAULT;

module.exports = (req, res, next) => {
  const {accessToken} = req.cookies;
  if (!accessToken) {
    res.sendStatus(HttpCodes.UNAUTHORIZED);
    return;
  }

  jwt.verify(accessToken, JWT_ACCESS_SECRET, (error) => {
    if (error) {
      res.sendStatus(HttpCodes.FORBIDDEN);
      return;
    }
    next();
  });
};
