'use strict';

const jwt = require(`jsonwebtoken`);

const {JWT_ACCESS_SECRET_DEFAULT} = require(`../../common/params`);
const {accountAdapter} = require(`../adapters`);


let JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || JWT_ACCESS_SECRET_DEFAULT;

module.exports = async (req, res, next) => {
  req.locals.account = null;
  const {accessToken} = req.cookies;
  if (!accessToken) {
    next();
  }
  await jwt.verify(accessToken, JWT_ACCESS_SECRET, async (error, userData) => {
    if (error) {
      return;
    }
    req.locals.account = await accountAdapter.getItemById(userData.id);
  });
  next();
};
