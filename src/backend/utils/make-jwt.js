'use strict';

const jwt = require(`jsonwebtoken`);

const {JWT_ACCESS_SECRET_DEFAULT, JWT_REFRESH_SECRET_DEFAULT} = require(`../../common/params`);


let JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || JWT_ACCESS_SECRET_DEFAULT;
let JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_REFRESH_SECRET_DEFAULT;

module.exports = (tokenData) => {
  const accessToken = jwt.sign(tokenData, JWT_ACCESS_SECRET, {expiresIn: `50s`});
  const refreshToken = jwt.sign(tokenData, JWT_REFRESH_SECRET);
  return {accessToken, refreshToken};
};