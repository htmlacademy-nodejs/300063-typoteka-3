'use strict';

const HttpCodes = require(`http-status-codes`);
const {makeJwt} = require(`../../../../utils`);
const {db} = require(`../../../../db`);


module.exports = async (req, res) => {
  const {user} = res.locals;
  const {accessToken, refreshToken} = await makeJwt(user);
  await db.RefreshToken.create({
    title: refreshToken,
  });
  res.status(HttpCodes.OK).json({accessToken, refreshToken});
};
