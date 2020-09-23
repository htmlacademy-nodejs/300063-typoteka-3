'use strict';

const HttpCodes = require(`http-status-codes`);

const {db} = require(`../../../../db`);
const {ERefreshTokenFieldName} = require(`../../../../models`);

module.exports = async (req, res) => {
  const {refreshToken} = req.cookies;
  if (!refreshToken) {
    return res.sendStatus(HttpCodes.BAD_REQUEST);
  }
  await db.RefreshToken.destroy({
    where: {
      [ERefreshTokenFieldName.TOKEN]: refreshToken,
    },
  });
  res.clearCookie(`accessToken`);
  res.clearCookie(`refreshToken`);
  return res.status(HttpCodes.NO_CONTENT).send();
};
