'use strict';

const jwt = require(`jsonwebtoken`);

const {commonParams} = require(`../../common/params`);
const {db} = require(`../db`);


let JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || commonParams.JWT_ACCESS_SECRET_DEFAULT;

module.exports = async (req, res, next) => {
  const {accessToken} = req.cookies;
  if (!accessToken) {
    next();
    return;
  }

  await jwt.verify(accessToken, JWT_ACCESS_SECRET, async (error, accountData) => {
    if (!error) {
      const {id: accountId} = accountData;
      req.locals.isUnauthorized = false;
      req.locals.account = await db.Account.findByPk(accountId);
    }
    next();
  });
};
