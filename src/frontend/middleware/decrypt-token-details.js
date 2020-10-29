'use strict';

const jwt = require(`jsonwebtoken`);

const {commonParams} = require(`../../common/params`);
const {accountAdapter} = require(`../adapters`);


const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || commonParams.JWT_ACCESS_SECRET_DEFAULT;

const refreshTokens = async (req, res, next) => {
  const refreshTokenRes = await accountAdapter.refreshToken({
    headers: req.headers,
  });
  if (refreshTokenRes.status !== `failed`) {
    res.set(`set-cookie`, refreshTokenRes);
    res.redirect(req.originalUrl);
    return;
  }
  if (res.clearCookie) {
    res.clearCookie(`accessToken`);
    res.clearCookie(`refreshToken`);
  }
  next();
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
