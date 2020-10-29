'use strict';

const HttpCodes = require(`http-status-codes`);

const {commonParams} = require(`../../../common/params`);
const {makeJwt} = require(`../../utils`);
const {db} = require(`../../db`);
const {ERefreshTokenFieldName} = require(`../../models`);


const MAX_AGE_ACCESS_TOKEN_COOKIE = process.env.MAX_AGE_ACCESS_TOKEN_COOKIE || commonParams.MAX_AGE_ACCESS_TOKEN_COOKIE;
const MAX_AGE_REFRESH_TOKEN_COOKIE = process.env.MAX_AGE_REFRESH_TOKEN_COOKIE || commonParams.MAX_AGE_REFRESH_TOKEN_COOKIE;

class LoginRoute {
  async post(req, res) {
    const {id} = res.locals.user;
    const {accessToken, refreshToken} = await makeJwt({id});
    await db.RefreshToken.create({
      [ERefreshTokenFieldName.TOKEN]: refreshToken,
    });
    res.cookie(`accessToken`, accessToken, {
      maxAge: MAX_AGE_ACCESS_TOKEN_COOKIE,
      sameSite: true,
    });
    res.cookie(`refreshToken`, refreshToken, {
      maxAge: MAX_AGE_REFRESH_TOKEN_COOKIE,
      httpOnly: true,
      sameSite: true,
    });
    res.status(HttpCodes.OK).send();
  }
}

module.exports = LoginRoute;
