'use strict';

const HttpCodes = require(`http-status-codes`);
const {makeJwt} = require(`../../../../utils`);
const {db} = require(`../../../../db`);
const {ERefreshTokenFieldName} = require(`../../../../models`);


module.exports = async (req, res) => {
  const {id} = res.locals.user;
  const {accessToken, refreshToken} = await makeJwt({id});
  await db.RefreshToken.create({
    [ERefreshTokenFieldName.TOKEN]: refreshToken,
  });
  res.cookie(`accessToken`, accessToken);
  res.cookie(`refreshToken`, refreshToken);
  res.status(HttpCodes.OK).send();
};
