'use strict';

const HttpCodes = require(`http-status-codes`);
const jwt = require(`jsonwebtoken`);

const {commonParams} = require(`../../../common/params`);
const {db} = require(`../../db`);
const {ERefreshTokenFieldName} = require(`../../models`);
const {makeJwt} = require(`../../utils`);


const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || commonParams.JWT_REFRESH_SECRET_DEFAULT;
const MAX_AGE_ACCESS_TOKEN_COOKIE = process.env.MAX_AGE_ACCESS_TOKEN_COOKIE || commonParams.MAX_AGE_ACCESS_TOKEN_COOKIE;
const MAX_AGE_REFRESH_TOKEN_COOKIE = process.env.MAX_AGE_REFRESH_TOKEN_COOKIE || commonParams.MAX_AGE_REFRESH_TOKEN_COOKIE;

class RefreshRoute {
  async post(req, res) {
    const {refreshToken: token} = req.cookies;
    if (!token) {
      return res.sendStatus(HttpCodes.BAD_REQUEST);
    }
    const existedToken = await db.RefreshToken.findOne({
      where: {
        [ERefreshTokenFieldName.TOKEN]: token,
      },
      raw: true,
    });
    if (!existedToken) {
      res.clearCookie(`accessToken`);
      res.clearCookie(`refreshToken`);
      return res.sendStatus(HttpCodes.NOT_FOUND);
    }

    await jwt.verify(token, JWT_REFRESH_SECRET, async (error, userData) => {
      if (error) {
        return res.sendStatus(HttpCodes.FORBIDDEN);
      }
      const {id} = userData;
      const {accessToken, refreshToken} = makeJwt({id});
      await db.RefreshToken.destroy({
        where: {
          [ERefreshTokenFieldName.TOKEN]: token,
        },
      });
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
      return res.sendStatus(HttpCodes.OK);
    });
    return res.status(HttpCodes.OK).send();
  }
}

module.exports = RefreshRoute;
