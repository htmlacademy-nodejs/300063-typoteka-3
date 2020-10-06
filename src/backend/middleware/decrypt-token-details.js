'use strict';

const jwt = require(`jsonwebtoken`);

const {commonParams} = require(`../../common/params`);


let JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || commonParams.JWT_ACCESS_SECRET_DEFAULT;

module.exports = async (req, res, next) => {
  const {accessToken} = req.cookies;
  if (!accessToken) {
    next();
    return;
  }

  await jwt.verify(accessToken, JWT_ACCESS_SECRET, async (error, tokenData) => {
    if (!error) {
      req.locals.tokenData = tokenData;
    }
    next();
  });
};
