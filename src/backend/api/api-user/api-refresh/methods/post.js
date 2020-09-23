'use strict';

const HttpCodes = require(`http-status-codes`);
const jwt = require(`jsonwebtoken`);

const {db} = require(`../../../../db`);
const {ERefreshTokenFieldName} = require(`../../../../models`);
const {makeJwt} = require(`../../../../utils`);
const {JWT_REFRESH_SECRET_DEFAULT} = require(`../../../../../common/params`);


const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_REFRESH_SECRET_DEFAULT;

module.exports = async (req, res) => {
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
    res.cookie(`accessToken`, accessToken);
    res.cookie(`refreshToken`, refreshToken);
    return res.sendStatus(HttpCodes.OK);
  });
  return res.status(HttpCodes.OK).send();
};
