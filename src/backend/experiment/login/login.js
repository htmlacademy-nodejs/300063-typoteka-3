'use strict';

const HttpCodes = require(`http-status-codes`);

const {makeJwt} = require(`../../utils`);
const {db} = require(`../../db`);
const {ERefreshTokenFieldName} = require(`../../models`);


class ApiLogin {
  async post(req, res) {
    const {id} = res.locals.user;
    const {accessToken, refreshToken} = await makeJwt({id});
    await db.RefreshToken.create({
      [ERefreshTokenFieldName.TOKEN]: refreshToken,
    });
    res.cookie(`accessToken`, accessToken, {
      maxAge: 1000 * 60 * 15,
      sameSite: true,
    });
    res.cookie(`refreshToken`, refreshToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: true,
    });
    res.status(HttpCodes.OK).send();
  }
}

module.exports = ApiLogin;
