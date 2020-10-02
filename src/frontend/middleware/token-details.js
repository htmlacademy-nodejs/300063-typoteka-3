'use strict';

const jwt = require(`jsonwebtoken`);

const {JWT_ACCESS_SECRET_DEFAULT} = require(`../../common/params`);
const {accountAdapter} = require(`../adapters`);


let JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || JWT_ACCESS_SECRET_DEFAULT;

const refreshTokens = async (req, res, next) => {
  const refreshTokenRes = await accountAdapter.refreshToken({
    headers: req.headers,
  });
  if (refreshTokenRes.status === `failed`) {
    res.clearCookie(`accessToken`);
    res.clearCookie(`refreshToken`);
    next();
    return;
  }
  res.set(`set-cookie`, refreshTokenRes);
  res.redirect(req.originalUrl);
};

module.exports = async (req, res, next) => {
  const {accessToken} = req.cookies;
  if (!accessToken) {
    await refreshTokens(req, res, next);
    return;
  }

  await jwt.verify(accessToken, JWT_ACCESS_SECRET, async (error, accountData) => {
    if (!error) {
      req.locals.accountData = accountData;
      next();
      return;
    }
    await refreshTokens(req, res, next);
  });
};
